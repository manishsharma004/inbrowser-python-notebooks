/** Python helpers installed into every Pyodide kernel (main thread or worker). */
export const SESSION_HELPERS_PYTHON = `
import builtins
import json
import os

_NB_SKIP_GLOBALS = set(dir(builtins)) | {
    "builtins", "json", "os", "pickle", "base64", "_NB_SKIP_GLOBALS",
    "nb_list_user_globals", "nb_list_environ", "nb_completion_snapshot",
    "nb_export_pickle_checkpoint", "nb_import_pickle_checkpoint",
    "nb_merge_pickle_checkpoint", "nb_drain_figure_pngs", "nb_hook_matplotlib_show",
    "nb_sync_workspace", "_NB_FIGURE_PNGS", "plt"
}

def nb_list_user_globals():
    out = {}
    for name, value in globals().items():
        if name.startswith("_") or name in _NB_SKIP_GLOBALS:
            continue
        try:
            text = repr(value)
        except Exception as exc:
            text = f"<{type(value).__name__}: {exc}>"
        if len(text) > 240:
            text = text[:237] + "..."
        out[name] = text
    return out

def nb_list_environ():
    return {str(k): str(v) for k, v in os.environ.items()}

def nb_completion_snapshot():
    import sys
    import types

    modules = sorted(
        set(getattr(sys, "builtin_module_names", ()))
        | {k.split(".")[0] for k in sys.modules.keys() if not k.startswith("_")}
    )

    members = {}
    for name, mod in list(sys.modules.items()):
        if name.startswith("_"):
            continue
        try:
            members[name] = [x for x in dir(mod) if not x.startswith("_")][:120]
        except Exception:
            continue

    for name, value in globals().items():
        if name.startswith("_") or name in _NB_SKIP_GLOBALS:
            continue
        try:
            if isinstance(value, types.ModuleType):
                members[name] = [x for x in dir(value) if not x.startswith("_")][:120]
        except Exception:
            continue

    user_globals = sorted(
        name
        for name in globals()
        if not name.startswith("_") and name not in _NB_SKIP_GLOBALS
    )

    return json.dumps({"modules": modules, "members": members, "globals": user_globals})

def nb_export_pickle_checkpoint():
    import pickle
    import base64

    payload = {}
    for name, value in list(globals().items()):
        if name.startswith("_") or name in _NB_SKIP_GLOBALS:
            continue
        try:
            payload[name] = pickle.dumps(value)
        except Exception:
            continue
    b64 = base64.b64encode(pickle.dumps(payload)).decode("ascii")
    return json.dumps({"b64": b64, "count": len(payload)})

def nb_import_pickle_checkpoint(b64_text):
    import pickle
    import base64

    restored = []
    failed = []
    try:
        payload = pickle.loads(base64.b64decode(b64_text))
    except Exception as exc:
        return json.dumps({"restored": restored, "failed": failed, "error": str(exc)})

    for name, blob in payload.items():
        try:
            globals()[name] = pickle.loads(blob)
            restored.append(name)
        except Exception:
            failed.append(name)
    return json.dumps({"restored": restored, "failed": failed, "error": None})

def nb_merge_pickle_checkpoint(b64_text, overwrite_names="0"):
    import pickle
    import base64

    overwrite = str(overwrite_names).lower() in ("1", "true", "yes")
    restored = []
    failed = []
    skipped = []
    try:
        payload = pickle.loads(base64.b64decode(b64_text))
    except Exception as exc:
        return json.dumps({"restored": restored, "failed": failed, "skipped": skipped, "error": str(exc)})

    user_globals = set(nb_list_user_globals().keys())

    for name, blob in payload.items():
        if name.startswith("_") or name in _NB_SKIP_GLOBALS:
            continue
        if not overwrite and name in user_globals:
            skipped.append(name)
            continue
        try:
            globals()[name] = pickle.loads(blob)
            restored.append(name)
        except Exception:
            failed.append(name)
    return json.dumps({"restored": restored, "failed": failed, "skipped": skipped, "error": None})

def nb_sync_workspace(files_json):
    files = json.loads(files_json)
    root = "/workspace"
    os.makedirs(root, exist_ok=True)
    for rel, content in files.items():
        path = root + "/" + str(rel).lstrip("/")
        parent = os.path.dirname(path)
        if parent:
            os.makedirs(parent, exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(str(content))
    return json.dumps({"count": len(files)})
`;

export const MATPLOTLIB_SETUP_PYTHON = `
import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
import io
import base64

_NB_FIGURE_PNGS = []

def nb_hook_matplotlib_show():
    def show(*_args, **_kwargs):
        for num in list(plt.get_fignums()):
            fig = plt.figure(num)
            bio = io.BytesIO()
            fig.savefig(
                bio,
                format="png",
                bbox_inches="tight",
                dpi=120,
                facecolor=fig.get_facecolor(),
                edgecolor="none",
            )
            _NB_FIGURE_PNGS.append(base64.b64encode(bio.getvalue()).decode("ascii"))
            plt.close(fig)

    plt.show = show

def nb_drain_figure_pngs():
    import json
    out = list(_NB_FIGURE_PNGS)
    _NB_FIGURE_PNGS.clear()
    return json.dumps(out)

nb_hook_matplotlib_show()
`;
