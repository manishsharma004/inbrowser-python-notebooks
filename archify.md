# Archify

## System Prompt
You are an architecture-writing assistant producing a grounded, upload-ready architecture prompt pack for this repository.
Treat `.archify` artifacts as the primary source of confirmed facts. Keep confirmed findings separate from inferred architecture and preserve uncertainty when evidence is weak.
Read the synthesis artifacts in the documented order before relying on any additional repository context.

## User Prompt
Use the grounded repository context below to produce the architecture artifact the user asks for.
Start by asking which architecture artifact the user wants from the supported options, then ask which visual style they want before generating any final architecture or diagram output.
Wait for those answers before finalizing the architecture response. If image generation is unavailable, return a render-ready diagram specification instead of pretending an image was created.

## Grounded Repository Context
Target path: `/workspace-2`
Scan root: `.`

System summary: workspace-2 contains 37 subsystems, 81 cross-subsystem flows, 0 processed documents, and 285 external dependencies derived from 498 extracted code nodes.

Grounded artifacts to read in order:
- `.archify/docs/archify/packet.json`
- `.archify/docs/archify/guide.json`
- `.archify/docs/archify/packet.json`
- `.archify/architecture-context.json`
- `.archify/facts.json`
- `.archify/modules.json`
- `.archify/services.json`
- `.archify/dependencies.json`
- `.archify/routes.json`
- `.archify/database.json`
- `.archify/docs-summary.json`
- `README.md`

Repository summary snapshots:
- Graph summary: {"communityCount": 37, "edgeCount": 711, "hyperedgeCount": 0, "nodeCount": 369, "warningCount": 0}
- Facts summary: {"ambiguousEdgeCount": 580, "confirmedCount": 125, "edgeCount": 711, "entrypointCount": 88, "extractedFileCount": 32, "inferredCount": 145, "nodeCount": 369, "subsystemCount": 37}
- Services summary: {}
- Routes summary: {}
- Database summary: {"boundaryCount": 0, "migrationCount": 0, "tableCount": 0}
- Dependencies summary: {}
- Docs summary: {"alignedDocumentCount": 0, "detectedDocumentCount": 6, "processedDocumentCount": 0, "skippedDocumentCount": 0, "themeCount": 0, "unresolvedDocumentCount": 0}

Supporting docs discovered by Archify:
- Primary README: `README.md`

## Confirmed From Codebase
### System Overview

workspace-2 contains 37 subsystems, 81 cross-subsystem flows, 0 processed documents, and 285 external dependencies derived from 498 extracted code nodes.

No grounded items were available for this section.

Evidence: artifact:.archify/architecture-context.json, artifact:.archify/facts.json

### Subsystems

Detected 37 subsystem(s) and 37 service surface(s).

- **src/lib**
  src/lib is a module subsystem covering 1 paths and 59 symbols; strongest evidence: calls x118.
  Kind: module
  Source paths: src/lib/pyodide/runtime.js
- **src/lib**
  src/lib is a adapter subsystem covering 1 paths and 54 symbols; strongest evidence: calls x93.
  Kind: adapter
  Source paths: src/lib/editor/monacoSetup.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 26 symbols; strongest evidence: calls x80, contains x6.
  Kind: module
  Source paths: src/lib/pyodide/kernelSessionStore.js
- **src/lib**
  src/lib is a infrastructure subsystem covering 1 paths and 25 symbols; strongest evidence: calls x44, contains x1.
  Kind: infrastructure
  Source paths: src/lib/pyodide/notebookPackages.js
- **src/lib**
  src/lib is a ui subsystem covering 1 paths and 23 symbols; strongest evidence: calls x54.
  Kind: ui
  Source paths: src/lib/editor/pythonBuiltins.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 21 symbols; strongest evidence: calls x43, contains x7.
  Kind: module
  Source paths: src/lib/notebook/jupyterFormat.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 12 symbols; strongest evidence: calls x35, contains x4.
  Kind: module
  Source paths: src/lib/editor/pythonModuleIndex.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 12 symbols; strongest evidence: calls x23, contains x6.
  Kind: module
  Source paths: src/lib/vfs/vfsTree.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 11 symbols; strongest evidence: calls x30, contains x2.
  Kind: module
  Source paths: src/lib/markdown/renderMarkdown.js
- **src/lib**
  src/lib is a ui subsystem covering 1 paths and 11 symbols; strongest evidence: calls x14, imports x3.
  Kind: ui
  Source paths: src/lib/utils/randomId.js
- **src/lib**
  src/lib is a service subsystem covering 1 paths and 10 symbols; strongest evidence: calls x23, imports x3.
  Kind: service
  Source paths: src/lib/vfs/indexedDbVfs.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 8 symbols; strongest evidence: calls x9, contains x3.
  Kind: module
  Source paths: src/lib/notebook/formatRunMeta.js
- **tests**
  tests is a module subsystem covering 1 paths and 8 symbols; strongest evidence: calls x36, imports x19.
  Kind: module
  Source paths: tests/formatRunMeta.test.js
- **src/lib**
  src/lib is a adapter subsystem covering 1 paths and 7 symbols; strongest evidence: calls x11.
  Kind: adapter
  Source paths: src/lib/editor/pyrightBridge.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 7 symbols; strongest evidence: calls x20, contains x3.
  Kind: module
  Source paths: src/lib/layout/panelLayout.js
- **tests**
  tests is a module subsystem covering 1 paths and 6 symbols; strongest evidence: calls x21, imports x2.
  Kind: module
  Source paths: tests/jupyterFormat.test.js
- **src/lib**
  src/lib is a ui subsystem covering 1 paths and 6 symbols; strongest evidence: calls x67, contains x6.
  Kind: ui
  Source paths: src/lib/editor/monacoSetup.js
- **vite.config.js**
  vite.config.js is a infrastructure subsystem covering 1 paths and 4 symbols; strongest evidence: calls x2, imports x2.
  Kind: infrastructure
  Source paths: vite.config.js
- **src/app.d.ts**
  src/app.d.ts is a adapter subsystem covering 1 paths and 3 symbols; strongest evidence: contains x3, calls x2.
  Kind: adapter
  Source paths: src/app.d.ts
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 3 symbols; strongest evidence: contains x3, imports x1.
  Kind: module
  Source paths: src/lib/editor/monacoCompletionState.js
- **tests**
  tests is a module subsystem covering 1 paths and 3 symbols; strongest evidence: calls x13, imports x2.
  Kind: module
  Source paths: tests/vfs.test.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 4 symbols; strongest evidence: calls x26, contains x4.
  Kind: module
  Source paths: src/lib/pyodide/runtime.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 2 symbols; strongest evidence: calls x1, contains x1.
  Kind: module
  Source paths: src/lib/editor/pyrightSync.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 2 symbols; strongest evidence: calls x6, contains x2.
  Kind: module
  Source paths: src/lib/notebook/parseNotebook.js
- **svelte.config.js**
  svelte.config.js is a adapter subsystem covering 1 paths and 2 symbols; strongest evidence: calls x1, imports x1.
  Kind: adapter
  Source paths: svelte.config.js
- **tests**
  tests is a module subsystem covering 1 paths and 2 symbols; strongest evidence: calls x4, imports x3.
  Kind: module
  Source paths: tests/markdown.test.js
- **tests**
  tests is a module subsystem covering 1 paths and 2 symbols; strongest evidence: calls x9, imports x3.
  Kind: module
  Source paths: tests/notebook.test.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 1 symbols; strongest evidence: imports x3, contains x1.
  Kind: module
  Source paths: src/lib/pyodide/kernelSessionKeys.js
- **tests**
  tests is a module subsystem covering 1 paths and 1 symbols; strongest evidence: calls x6, imports x3.
  Kind: module
  Source paths: tests/kernelSessionKeys.test.js
- **tests**
  tests is a module subsystem covering 1 paths and 1 symbols; strongest evidence: calls x7, imports x2.
  Kind: module
  Source paths: tests/panelLayout.test.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 0 symbols; strongest evidence: contains x4, imports x2.
  Kind: module
  Source paths: src/lib/editor/monacoSetup.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 0 symbols; strongest evidence: calls x157, contains x4.
  Kind: module
  Source paths: src/lib/pyodide/runtime.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 0 symbols; strongest evidence: structure-only edges.
  Kind: module
  Source paths: src/lib/vfs/types.js
- **src/routes**
  src/routes is a module subsystem covering 1 paths and 0 symbols; strongest evidence: structure-only edges.
  Kind: module
  Source paths: src/routes/+layout.js
- **tests**
  tests is a module subsystem covering 1 paths and 0 symbols; strongest evidence: calls x14, imports x2.
  Kind: module
  Source paths: tests/pythonModuleIndex.test.js
- **tests**
  tests is a module subsystem covering 1 paths and 0 symbols; strongest evidence: calls x7, imports x3.
  Kind: module
  Source paths: tests/randomId.test.js
- **src/lib**
  src/lib is a module subsystem covering 1 paths and 1 symbols; strongest evidence: imports x1.
  Kind: module
  Source paths: src/lib/editor/monacoSetup.js

### Entrypoints And Interfaces

Detected 88 entrypoint candidate(s), 88 confirmed route(s), and 0 table(s).

- **cleanupStrayMatplotlibWidgets**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:278:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:287:0, edge:symbol_src_lib_pyodide_runtime_js_function_resetpythonruntime:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:223:0, ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets
- **pyodide.runPython**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:275:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:312:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:313:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:339:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:370:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:394:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:396:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:427:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:431:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:244:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:249:0, ref_src_lib_pyodide_runtime_js_call_pyodide_runpython
- **handler**
  Kind: route
  Source path: src/lib/vfs/indexedDbVfs.js
  Subsystem: subsystem-10-0-src-lib
  Evidence: edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_vfs_indexeddbvfs_js_call_handler:src/lib/vfs/indexedDbVfs.js:65:0, ref_src_lib_vfs_indexeddbvfs_js_call_handler
- **runTransaction()**
  Kind: cli
  Source path: src/lib/vfs/indexedDbVfs.js
  Subsystem: subsystem-10-0-src-lib
  Evidence: edge:file_src_lib_vfs_indexeddbvfs_js:calls:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:src/lib/vfs/indexedDbVfs.js:106:0, edge:file_src_lib_vfs_indexeddbvfs_js:calls:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:src/lib/vfs/indexedDbVfs.js:79:0, edge:file_src_lib_vfs_indexeddbvfs_js:calls:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:src/lib/vfs/indexedDbVfs.js:91:0, edge:file_src_lib_vfs_indexeddbvfs_js:contains:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:src/lib/vfs/indexedDbVfs.js:57:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/indexedDbVfs.js:68:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_db_transaction:src/lib/vfs/indexedDbVfs.js:63:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise:src/lib/vfs/indexedDbVfs.js:62:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/vfs/indexedDbVfs.js:68:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_resolve:src/lib/vfs/indexedDbVfs.js:66:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_vfs_indexeddbvfs_js_call_handler:src/lib/vfs/indexedDbVfs.js:65:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_vfs_indexeddbvfs_js_call_then:src/lib/vfs/indexedDbVfs.js:58:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_vfs_indexeddbvfs_js_call_transaction_objectstore:src/lib/vfs/indexedDbVfs.js:64:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:src/lib/vfs/indexedDbVfs.js:58:0, symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction
- **Number.isFinite**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_number_isfinite:src/lib/notebook/formatRunMeta.js:6:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:calls:ref_src_lib_notebook_formatrunmeta_js_call_number_isfinite:src/lib/notebook/formatRunMeta.js:18:0, ref_src_lib_notebook_formatrunmeta_js_call_number_isfinite
- **formatDuration()**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:file_src_lib_notebook_formatrunmeta_js:contains:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:src/lib/notebook/formatRunMeta.js:5:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_math_round:src/lib/notebook/formatRunMeta.js:8:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_number_isfinite:src/lib/notebook/formatRunMeta.js:6:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_tofixed:src/lib/notebook/formatRunMeta.js:10:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_tofixed:src/lib/notebook/formatRunMeta.js:9:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatrunsummary:calls:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:src/lib/notebook/formatRunMeta.js:36:0, symbol_src_lib_notebook_formatrunmeta_js_function_formatduration
- **formatRunSummary()**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:file_src_lib_notebook_formatrunmeta_js:contains:symbol_src_lib_notebook_formatrunmeta_js_function_formatrunsummary:src/lib/notebook/formatRunMeta.js:35:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatrunsummary:calls:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:src/lib/notebook/formatRunMeta.js:36:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatrunsummary:calls:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:src/lib/notebook/formatRunMeta.js:36:0, symbol_src_lib_notebook_formatrunmeta_js_function_formatrunsummary
- **formatRunTimestamp()**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:file_src_lib_notebook_formatrunmeta_js:contains:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:src/lib/notebook/formatRunMeta.js:17:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatrunsummary:calls:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:src/lib/notebook/formatRunMeta.js:36:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:calls:ref_src_lib_notebook_formatrunmeta_js_call_date:src/lib/notebook/formatRunMeta.js:19:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:calls:ref_src_lib_notebook_formatrunmeta_js_call_number_isfinite:src/lib/notebook/formatRunMeta.js:18:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:calls:ref_src_lib_notebook_formatrunmeta_js_call_tolocalestring:src/lib/notebook/formatRunMeta.js:19:0, symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp
- **src/lib/notebook/formatRunMeta.js**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:file_src_lib_notebook_formatrunmeta_js:contains:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:src/lib/notebook/formatRunMeta.js:5:0, edge:file_src_lib_notebook_formatrunmeta_js:contains:symbol_src_lib_notebook_formatrunmeta_js_function_formatrunsummary:src/lib/notebook/formatRunMeta.js:35:0, edge:file_src_lib_notebook_formatrunmeta_js:contains:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:src/lib/notebook/formatRunMeta.js:17:0, edge:file_tests_formatrunmeta_test_js:imports:file_src_lib_notebook_formatrunmeta_js:tests/formatRunMeta.test.js:3:0, file_src_lib_notebook_formatrunmeta_js
- **assert.equal**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/formatRunMeta.test.js:6:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/formatRunMeta.test.js:7:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/formatRunMeta.test.js:8:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:26:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:27:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:28:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:37:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:38:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:42:0, edge:file_tests_notebook_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/notebook.test.js:19:0, edge:file_tests_notebook_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/notebook.test.js:7:0, edge:file_tests_notebook_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/notebook.test.js:8:0, edge:file_tests_notebook_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/notebook.test.js:9:0, edge:file_tests_panellayout_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/panelLayout.test.js:12:0, edge:file_tests_panellayout_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/panelLayout.test.js:13:0, edge:file_tests_panellayout_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/panelLayout.test.js:14:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/pythonModuleIndex.test.js:10:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/pythonModuleIndex.test.js:11:0, edge:file_tests_vfs_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/vfs.test.js:14:0, edge:file_tests_vfs_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/vfs.test.js:23:0, edge:file_tests_vfs_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/vfs.test.js:24:0, ref_tests_formatrunmeta_test_js_call_assert_equal
- **assert.match**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_match:tests/formatRunMeta.test.js:13:0, edge:file_tests_kernelsessionkeys_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_match:tests/kernelSessionKeys.test.js:7:0, edge:file_tests_markdown_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_match:tests/markdown.test.js:7:0, edge:file_tests_randomid_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_match:tests/randomId.test.js:7:0, ref_tests_formatrunmeta_test_js_call_assert_match
- **assert.ok**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_ok:tests/formatRunMeta.test.js:14:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_ok:tests/jupyterFormat.test.js:41:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_ok:tests/pythonModuleIndex.test.js:23:0, edge:file_tests_vfs_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_ok:tests/vfs.test.js:12:0, ref_tests_formatrunmeta_test_js_call_assert_ok
- **node:assert/strict**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/formatRunMeta.test.js:1:0, edge:file_tests_jupyterformat_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/jupyterFormat.test.js:1:0, edge:file_tests_kernelsessionkeys_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/kernelSessionKeys.test.js:1:0, edge:file_tests_markdown_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/markdown.test.js:1:0, edge:file_tests_notebook_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/notebook.test.js:1:0, edge:file_tests_panellayout_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/panelLayout.test.js:1:0, edge:file_tests_pythonmoduleindex_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/pythonModuleIndex.test.js:1:0, edge:file_tests_randomid_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/randomId.test.js:1:0, edge:file_tests_vfs_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/vfs.test.js:1:0, ref_tests_formatrunmeta_test_js_import_node_assert_strict
- **node:test**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/formatRunMeta.test.js:2:0, edge:file_tests_jupyterformat_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/jupyterFormat.test.js:2:0, edge:file_tests_kernelsessionkeys_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/kernelSessionKeys.test.js:2:0, edge:file_tests_markdown_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/markdown.test.js:2:0, edge:file_tests_notebook_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/notebook.test.js:2:0, edge:file_tests_panellayout_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/panelLayout.test.js:2:0, edge:file_tests_pythonmoduleindex_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/pythonModuleIndex.test.js:2:0, edge:file_tests_randomid_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/randomId.test.js:2:0, edge:file_tests_vfs_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/vfs.test.js:2:0, ref_tests_formatrunmeta_test_js_import_node_test
- **tests/formatRunMeta.test.js**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/formatRunMeta.test.js:11:0, edge:file_tests_formatrunmeta_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/formatRunMeta.test.js:5:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/formatRunMeta.test.js:6:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/formatRunMeta.test.js:7:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/formatRunMeta.test.js:8:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_match:tests/formatRunMeta.test.js:13:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_ok:tests/formatRunMeta.test.js:14:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_date_utc:tests/formatRunMeta.test.js:12:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_formatduration:tests/formatRunMeta.test.js:6:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_formatduration:tests/formatRunMeta.test.js:7:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_formatduration:tests/formatRunMeta.test.js:8:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_formatruntimestamp:tests/formatRunMeta.test.js:12:0, edge:file_tests_formatrunmeta_test_js:imports:file_src_lib_notebook_formatrunmeta_js:tests/formatRunMeta.test.js:3:0, edge:file_tests_formatrunmeta_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/formatRunMeta.test.js:1:0, edge:file_tests_formatrunmeta_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/formatRunMeta.test.js:2:0, file_tests_formatrunmeta_test_js
- **appendPyodideScript()**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-21-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:src/lib/pyodide/runtime.js:69:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:src/lib/pyodide/runtime.js:33:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:35:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:46:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:57:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_notebook_jupyterformat_js_call_document_createelement:src/lib/pyodide/runtime.js:52:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise:src/lib/pyodide/runtime.js:40:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise_resolve:src/lib/pyodide/runtime.js:38:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/pyodide/runtime.js:46:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/pyodide/runtime.js:57:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_resolve:src/lib/pyodide/runtime.js:43:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_resolve:src/lib/pyodide/runtime.js:56:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_document_queryselector:src/lib/pyodide/runtime.js:41:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener:src/lib/pyodide/runtime.js:43:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener:src/lib/pyodide/runtime.js:44:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_head_append:src/lib/pyodide/runtime.js:58:0, symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript
- **drainFigurePngs()**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-21-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:277:0, edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:286:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:242:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:250:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:251:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_nb_drain_figure_pngs:src/lib/pyodide/runtime.js:249:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_plt_get_fignums:src/lib/pyodide/runtime.js:246:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_plt_show:src/lib/pyodide/runtime.js:247:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_parsed_filter:src/lib/pyodide/runtime.js:252:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:244:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:249:0, symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs
- **resetPythonRuntime()**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-21-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_resetpythonruntime:src/lib/pyodide/runtime.js:222:0, edge:symbol_src_lib_pyodide_runtime_js_function_resetpythonruntime:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:223:0, symbol_src_lib_pyodide_runtime_js_function_resetpythonruntime
- **pyodide.runPythonAsync**
  Kind: cli
  Source path: src/lib/pyodide/notebookPackages.js
  Subsystem: subsystem-3-0-src-lib
  Evidence: edge:file_src_lib_pyodide_notebookpackages_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_pyodide_runpythonasync:src/lib/pyodide/notebookPackages.js:17:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_pyodide_runpythonasync:src/lib/pyodide/runtime.js:276:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_pyodide_runpythonasync:src/lib/pyodide/runtime.js:94:0, ref_src_lib_pyodide_notebookpackages_js_call_pyodide_runpythonasync
- **src/lib/pyodide/runtime.js**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-31-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:72:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:281:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:282:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:290:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:291:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pyrightbridge_js_call_async:src/lib/pyodide/runtime.js:23:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pyrightbridge_js_call_async:src/lib/pyodide/runtime.js:68:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_isinstance:src/lib/pyodide/runtime.js:146:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_len:src/lib/pyodide/runtime.js:116:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_len:src/lib/pyodide/runtime.js:166:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/runtime.js:134:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/runtime.js:158:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_set:src/lib/pyodide/runtime.js:129:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_set:src/lib/pyodide/runtime.js:200:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_set:src/lib/pyodide/runtime.js:99:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_sorted:src/lib/pyodide/runtime.js:128:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_str:src/lib/pyodide/runtime.js:122:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_str:src/lib/pyodide/runtime.js:177:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_str:src/lib/pyodide/runtime.js:191:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_str:src/lib/pyodide/runtime.js:198:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_type:src/lib/pyodide/runtime.js:115:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:341:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:371:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:398:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:437:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:345:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:401:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:402:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:439:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:440:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:441:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_base64_b64encode:src/lib/pyodide/runtime.js:165:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_decode:src/lib/pyodide/runtime.js:165:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:151:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:166:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:177:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:185:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:198:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:213:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_loadnotebookpackages:src/lib/pyodide/runtime.js:24:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_nb_drain_figure_pngs:src/lib/pyodide/runtime.js:275:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_plt_show:src/lib/pyodide/runtime.js:235:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_pyodide_runpythonasync:src/lib/pyodide/runtime.js:276:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_pyodide_runpythonasync:src/lib/pyodide/runtime.js:94:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_base64_b64decode:src/lib/pyodide/runtime.js:175:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_base64_b64decode:src/lib/pyodide/runtime.js:196:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:278:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:287:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:138:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:147:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:99:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurenotebookpackages:src/lib/pyodide/runtime.js:21:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurenotebookpackages:src/lib/pyodide/runtime.js:75:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:265:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:309:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:336:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:368:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:390:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:422:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:66:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environ_items:src/lib/pyodide/runtime.js:122:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environproxy_destroy:src/lib/pyodide/runtime.js:321:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environproxy_tojs:src/lib/pyodide/runtime.js:318:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_exportkernelcheckpoint:src/lib/pyodide/runtime.js:367:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_failed_append:src/lib/pyodide/runtime.js:184:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_failed_append:src/lib/pyodide/runtime.js:212:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_getattr:src/lib/pyodide/runtime.js:129:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:109:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:142:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:158:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:181:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:209:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:392:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:424:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:425:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globalsproxy_destroy:src/lib/pyodide/runtime.js:320:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globalsproxy_tojs:src/lib/pyodide/runtime.js:315:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_importkernelcheckpoint:src/lib/pyodide/runtime.js:389:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_in:src/lib/pyodide/runtime.js:191:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_inspectpythoncompletions:src/lib/pyodide/runtime.js:335:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_inspectpythonsession:src/lib/pyodide/runtime.js:308:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:310:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:337:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:369:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:391:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:423:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:76:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:91:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_interpreter:src/lib/pyodide/runtime.js:220:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:109:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:142:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:158:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_k_split:src/lib/pyodide/runtime.js:130:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_k_startswith:src/lib/pyodide/runtime.js:130:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_keys:src/lib/pyodide/runtime.js:200:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_loadpyodide:src/lib/pyodide/runtime.js:74:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_lower:src/lib/pyodide/runtime.js:191:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_mergekernelcheckpoint:src/lib/pyodide/runtime.js:421:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_modules_items:src/lib/pyodide/runtime.js:134:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_modules_keys:src/lib/pyodide/runtime.js:130:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:110:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:135:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:143:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:159:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:203:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_completion_snapshot:src/lib/pyodide/runtime.js:124:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_completion_snapshot:src/lib/pyodide/runtime.js:339:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_export_pickle_checkpoint:src/lib/pyodide/runtime.js:153:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_export_pickle_checkpoint:src/lib/pyodide/runtime.js:370:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_import_pickle_checkpoint:src/lib/pyodide/runtime.js:168:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_import_pickle_checkpoint:src/lib/pyodide/runtime.js:394:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_environ:src/lib/pyodide/runtime.js:121:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_environ:src/lib/pyodide/runtime.js:313:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:107:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:200:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:312:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_merge_pickle_checkpoint:src/lib/pyodide/runtime.js:187:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_merge_pickle_checkpoint:src/lib/pyodide/runtime.js:428:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_order:src/lib/pyodide/runtime.js:447:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_payload_items:src/lib/pyodide/runtime.js:179:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_payload_items:src/lib/pyodide/runtime.js:202:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_dumps:src/lib/pyodide/runtime.js:162:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_dumps:src/lib/pyodide/runtime.js:165:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:175:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:181:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:196:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:209:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:275:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:312:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:313:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:339:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:370:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:394:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:396:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:427:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:431:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_setstderr:src/lib/pyodide/runtime.js:272:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_setstdout:src/lib/pyodide/runtime.js:271:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_replaykerneljournal:src/lib/pyodide/runtime.js:451:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_repr:src/lib/pyodide/runtime.js:113:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_restored_append:src/lib/pyodide/runtime.js:182:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_restored_append:src/lib/pyodide/runtime.js:210:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runpythonsource:src/lib/pyodide/runtime.js:264:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runpythonsource:src/lib/pyodide/runtime.js:455:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runtime:src/lib/pyodide/runtime.js:260:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_skipped_append:src/lib/pyodide/runtime.js:206:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_join:src/lib/pyodide/runtime.js:282:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_join:src/lib/pyodide/runtime.js:291:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_push:src/lib/pyodide/runtime.js:272:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_join:src/lib/pyodide/runtime.js:281:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_join:src/lib/pyodide/runtime.js:290:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_push:src/lib/pyodide/runtime.js:271:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_x_startswith:src/lib/pyodide/runtime.js:138:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_x_startswith:src/lib/pyodide/runtime.js:147:0, edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:src/lib/pyodide/runtime.js:69:0, edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:277:0, edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:286:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:src/lib/pyodide/runtime.js:33:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:242:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_ispythonruntimeready:src/lib/pyodide/runtime.js:353:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_resetpythonruntime:src/lib/pyodide/runtime.js:222:0, file_src_lib_pyodide_runtime_js
- **src/routes/+layout.js**
  Kind: route
  Source path: src/routes/+layout.js
  Subsystem: subsystem-33-0-src-routes
  Evidence: file_src_routes_layout_js
- **base64.b64decode**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_base64_b64decode:src/lib/pyodide/runtime.js:175:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_base64_b64decode:src/lib/pyodide/runtime.js:196:0, ref_src_lib_pyodide_runtime_js_call_base64_b64decode
- **dir**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:138:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:147:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:99:0, ref_src_lib_pyodide_runtime_js_call_dir
- **document.querySelector**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_document_queryselector:src/lib/pyodide/runtime.js:41:0, ref_src_lib_pyodide_runtime_js_call_document_queryselector
- **ensureNotebookPackages**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurenotebookpackages:src/lib/pyodide/runtime.js:21:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurenotebookpackages:src/lib/pyodide/runtime.js:75:0, ref_src_lib_pyodide_runtime_js_call_ensurenotebookpackages
- **ensurePythonRuntime**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:265:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:309:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:336:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:368:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:390:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:422:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:66:0, ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime
- **environ.items**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environ_items:src/lib/pyodide/runtime.js:122:0, ref_src_lib_pyodide_runtime_js_call_environ_items
- **environProxy.destroy**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environproxy_destroy:src/lib/pyodide/runtime.js:321:0, ref_src_lib_pyodide_runtime_js_call_environproxy_destroy
- **environProxy.toJs**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environproxy_tojs:src/lib/pyodide/runtime.js:318:0, ref_src_lib_pyodide_runtime_js_call_environproxy_tojs
- **existing.addEventListener**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener:src/lib/pyodide/runtime.js:43:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener:src/lib/pyodide/runtime.js:44:0, ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener
- **exportKernelCheckpoint**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_exportkernelcheckpoint:src/lib/pyodide/runtime.js:367:0, ref_src_lib_pyodide_runtime_js_call_exportkernelcheckpoint
- **failed.append**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_failed_append:src/lib/pyodide/runtime.js:184:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_failed_append:src/lib/pyodide/runtime.js:212:0, ref_src_lib_pyodide_runtime_js_call_failed_append
- **getattr**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_getattr:src/lib/pyodide/runtime.js:129:0, ref_src_lib_pyodide_runtime_js_call_getattr
- **globals**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:109:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:142:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:158:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:181:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:209:0, ref_src_lib_pyodide_runtime_js_call_globals
- **globals.set**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:392:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:424:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:425:0, ref_src_lib_pyodide_runtime_js_call_globals_set
- **globalsProxy.destroy**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globalsproxy_destroy:src/lib/pyodide/runtime.js:320:0, ref_src_lib_pyodide_runtime_js_call_globalsproxy_destroy
- **globalsProxy.toJs**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globalsproxy_tojs:src/lib/pyodide/runtime.js:315:0, ref_src_lib_pyodide_runtime_js_call_globalsproxy_tojs
- **head.append**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_head_append:src/lib/pyodide/runtime.js:58:0, ref_src_lib_pyodide_runtime_js_call_head_append
- **importKernelCheckpoint**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_importkernelcheckpoint:src/lib/pyodide/runtime.js:389:0, ref_src_lib_pyodide_runtime_js_call_importkernelcheckpoint
- **in**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_in:src/lib/pyodide/runtime.js:191:0, ref_src_lib_pyodide_runtime_js_call_in
- **inspectPythonCompletions**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_inspectpythoncompletions:src/lib/pyodide/runtime.js:335:0, ref_src_lib_pyodide_runtime_js_call_inspectpythoncompletions
- **inspectPythonSession**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_inspectpythonsession:src/lib/pyodide/runtime.js:308:0, ref_src_lib_pyodide_runtime_js_call_inspectpythonsession
- **installSessionHelpers**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:310:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:337:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:369:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:391:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:423:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:76:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:91:0, ref_src_lib_pyodide_runtime_js_call_installsessionhelpers
- **interpreter**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_interpreter:src/lib/pyodide/runtime.js:220:0, ref_src_lib_pyodide_runtime_js_call_interpreter
- **items**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:109:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:142:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:158:0, ref_src_lib_pyodide_runtime_js_call_items
- **k.split**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_k_split:src/lib/pyodide/runtime.js:130:0, ref_src_lib_pyodide_runtime_js_call_k_split
- **k.startswith**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_k_startswith:src/lib/pyodide/runtime.js:130:0, ref_src_lib_pyodide_runtime_js_call_k_startswith
- **keys**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_keys:src/lib/pyodide/runtime.js:200:0, ref_src_lib_pyodide_runtime_js_call_keys
- **loadPyodide**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_loadpyodide:src/lib/pyodide/runtime.js:74:0, ref_src_lib_pyodide_runtime_js_call_loadpyodide
- **lower**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_lower:src/lib/pyodide/runtime.js:191:0, ref_src_lib_pyodide_runtime_js_call_lower
- **mergeKernelCheckpoint**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_mergekernelcheckpoint:src/lib/pyodide/runtime.js:421:0, ref_src_lib_pyodide_runtime_js_call_mergekernelcheckpoint
- **modules.items**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_modules_items:src/lib/pyodide/runtime.js:134:0, ref_src_lib_pyodide_runtime_js_call_modules_items
- **modules.keys**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_modules_keys:src/lib/pyodide/runtime.js:130:0, ref_src_lib_pyodide_runtime_js_call_modules_keys
- **name.startswith**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:110:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:135:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:143:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:159:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:203:0, ref_src_lib_pyodide_runtime_js_call_name_startswith
- **nb_completion_snapshot**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_completion_snapshot:src/lib/pyodide/runtime.js:124:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_completion_snapshot:src/lib/pyodide/runtime.js:339:0, ref_src_lib_pyodide_runtime_js_call_nb_completion_snapshot
- **nb_export_pickle_checkpoint**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_export_pickle_checkpoint:src/lib/pyodide/runtime.js:153:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_export_pickle_checkpoint:src/lib/pyodide/runtime.js:370:0, ref_src_lib_pyodide_runtime_js_call_nb_export_pickle_checkpoint
- **nb_import_pickle_checkpoint**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_import_pickle_checkpoint:src/lib/pyodide/runtime.js:168:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_import_pickle_checkpoint:src/lib/pyodide/runtime.js:394:0, ref_src_lib_pyodide_runtime_js_call_nb_import_pickle_checkpoint
- **nb_list_environ**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_environ:src/lib/pyodide/runtime.js:121:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_environ:src/lib/pyodide/runtime.js:313:0, ref_src_lib_pyodide_runtime_js_call_nb_list_environ
- **nb_list_user_globals**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:107:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:200:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:312:0, ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals
- **nb_merge_pickle_checkpoint**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_merge_pickle_checkpoint:src/lib/pyodide/runtime.js:187:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_merge_pickle_checkpoint:src/lib/pyodide/runtime.js:428:0, ref_src_lib_pyodide_runtime_js_call_nb_merge_pickle_checkpoint
- **order**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_order:src/lib/pyodide/runtime.js:447:0, ref_src_lib_pyodide_runtime_js_call_order
- **parsed.filter**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_parsed_filter:src/lib/pyodide/runtime.js:252:0, ref_src_lib_pyodide_runtime_js_call_parsed_filter
- **payload.items**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_payload_items:src/lib/pyodide/runtime.js:179:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_payload_items:src/lib/pyodide/runtime.js:202:0, ref_src_lib_pyodide_runtime_js_call_payload_items
- **pickle.dumps**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_dumps:src/lib/pyodide/runtime.js:162:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_dumps:src/lib/pyodide/runtime.js:165:0, ref_src_lib_pyodide_runtime_js_call_pickle_dumps
- **pickle.loads**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:175:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:181:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:196:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:209:0, ref_src_lib_pyodide_runtime_js_call_pickle_loads
- **pyodide.setStderr**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_setstderr:src/lib/pyodide/runtime.js:272:0, ref_src_lib_pyodide_runtime_js_call_pyodide_setstderr
- **pyodide.setStdout**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_setstdout:src/lib/pyodide/runtime.js:271:0, ref_src_lib_pyodide_runtime_js_call_pyodide_setstdout
- **replayKernelJournal**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_replaykerneljournal:src/lib/pyodide/runtime.js:451:0, ref_src_lib_pyodide_runtime_js_call_replaykerneljournal
- **repr**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_repr:src/lib/pyodide/runtime.js:113:0, ref_src_lib_pyodide_runtime_js_call_repr
- **restored.append**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_restored_append:src/lib/pyodide/runtime.js:182:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_restored_append:src/lib/pyodide/runtime.js:210:0, ref_src_lib_pyodide_runtime_js_call_restored_append
- **runPythonSource**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runpythonsource:src/lib/pyodide/runtime.js:264:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runpythonsource:src/lib/pyodide/runtime.js:455:0, ref_src_lib_pyodide_runtime_js_call_runpythonsource
- **runtime**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runtime:src/lib/pyodide/runtime.js:260:0, ref_src_lib_pyodide_runtime_js_call_runtime
- **skipped.append**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_skipped_append:src/lib/pyodide/runtime.js:206:0, ref_src_lib_pyodide_runtime_js_call_skipped_append
- **stderr.join**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_join:src/lib/pyodide/runtime.js:282:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_join:src/lib/pyodide/runtime.js:291:0, ref_src_lib_pyodide_runtime_js_call_stderr_join
- **stderr.push**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_push:src/lib/pyodide/runtime.js:272:0, ref_src_lib_pyodide_runtime_js_call_stderr_push
- **stdout.join**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_join:src/lib/pyodide/runtime.js:281:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_join:src/lib/pyodide/runtime.js:290:0, ref_src_lib_pyodide_runtime_js_call_stdout_join
- **stdout.push**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_push:src/lib/pyodide/runtime.js:271:0, ref_src_lib_pyodide_runtime_js_call_stdout_push
- **x.startswith**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_x_startswith:src/lib/pyodide/runtime.js:138:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_x_startswith:src/lib/pyodide/runtime.js:147:0, ref_src_lib_pyodide_runtime_js_call_x_startswith
- **runAction.dispose**
  Kind: cli
  Source path: src/lib/editor/monacoSetup.js
  Subsystem: subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_runaction_dispose:src/lib/editor/monacoSetup.js:379:0, ref_src_lib_editor_monacosetup_js_call_runaction_dispose
- **Date**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:calls:ref_src_lib_notebook_formatrunmeta_js_call_date:src/lib/notebook/formatRunMeta.js:19:0, ref_src_lib_notebook_formatrunmeta_js_call_date
- **Math.round**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_math_round:src/lib/notebook/formatRunMeta.js:8:0, ref_src_lib_notebook_formatrunmeta_js_call_math_round
- **toFixed**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_tofixed:src/lib/notebook/formatRunMeta.js:10:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_tofixed:src/lib/notebook/formatRunMeta.js:9:0, ref_src_lib_notebook_formatrunmeta_js_call_tofixed
- **toLocaleString**
  Kind: cli
  Source path: src/lib/notebook/formatRunMeta.js
  Subsystem: subsystem-11-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:calls:ref_src_lib_notebook_formatrunmeta_js_call_tolocalestring:src/lib/notebook/formatRunMeta.js:19:0, ref_src_lib_notebook_formatrunmeta_js_call_tolocalestring
- **Date.UTC**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_date_utc:tests/formatRunMeta.test.js:12:0, ref_tests_formatrunmeta_test_js_call_date_utc
- **formatDuration**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_formatduration:tests/formatRunMeta.test.js:6:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_formatduration:tests/formatRunMeta.test.js:7:0, edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_formatduration:tests/formatRunMeta.test.js:8:0, ref_tests_formatrunmeta_test_js_call_formatduration
- **formatRunTimestamp**
  Kind: cli
  Source path: tests/formatRunMeta.test.js
  Subsystem: subsystem-12-0-tests
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_tests_formatrunmeta_test_js_call_formatruntimestamp:tests/formatRunMeta.test.js:12:0, ref_tests_formatrunmeta_test_js_call_formatruntimestamp
- **isPythonRuntimeReady()**
  Kind: cli
  Source path: src/lib/pyodide/runtime.js
  Subsystem: subsystem-21-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_ispythonruntimeready:src/lib/pyodide/runtime.js:353:0, symbol_src_lib_pyodide_runtime_js_function_ispythonruntimeready
- **anchor.click**
  Kind: cli
  Source path: src/lib/notebook/jupyterFormat.js
  Subsystem: subsystem-5-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_jupyterformat_js_function_downloadtextfile:calls:ref_src_lib_notebook_jupyterformat_js_call_anchor_click:src/lib/notebook/jupyterFormat.js:131:0, ref_src_lib_notebook_jupyterformat_js_call_anchor_click

Evidence: edge:file_src_lib_notebook_formatrunmeta_js:contains:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:src/lib/notebook/formatRunMeta.js:5:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:278:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:287:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:275:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:312:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:313:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:339:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:370:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:394:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:396:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:427:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:431:0, edge:file_src_lib_vfs_indexeddbvfs_js:calls:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:src/lib/vfs/indexedDbVfs.js:106:0, edge:file_src_lib_vfs_indexeddbvfs_js:calls:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:src/lib/vfs/indexedDbVfs.js:79:0, edge:file_src_lib_vfs_indexeddbvfs_js:calls:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:src/lib/vfs/indexedDbVfs.js:91:0, edge:file_src_lib_vfs_indexeddbvfs_js:contains:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:src/lib/vfs/indexedDbVfs.js:57:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_math_round:src/lib/notebook/formatRunMeta.js:8:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_number_isfinite:src/lib/notebook/formatRunMeta.js:6:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_tofixed:src/lib/notebook/formatRunMeta.js:10:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:calls:ref_src_lib_notebook_formatrunmeta_js_call_tofixed:src/lib/notebook/formatRunMeta.js:9:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatrunsummary:calls:symbol_src_lib_notebook_formatrunmeta_js_function_formatduration:src/lib/notebook/formatRunMeta.js:36:0, edge:symbol_src_lib_notebook_formatrunmeta_js_function_formatruntimestamp:calls:ref_src_lib_notebook_formatrunmeta_js_call_number_isfinite:src/lib/notebook/formatRunMeta.js:18:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:244:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:249:0, edge:symbol_src_lib_pyodide_runtime_js_function_resetpythonruntime:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:223:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/indexedDbVfs.js:68:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_db_transaction:src/lib/vfs/indexedDbVfs.js:63:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise:src/lib/vfs/indexedDbVfs.js:62:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/vfs/indexedDbVfs.js:68:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_resolve:src/lib/vfs/indexedDbVfs.js:66:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_vfs_indexeddbvfs_js_call_handler:src/lib/vfs/indexedDbVfs.js:65:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_vfs_indexeddbvfs_js_call_then:src/lib/vfs/indexedDbVfs.js:58:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_vfs_indexeddbvfs_js_call_transaction_objectstore:src/lib/vfs/indexedDbVfs.js:64:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:src/lib/vfs/indexedDbVfs.js:58:0, ref_src_lib_notebook_formatrunmeta_js_call_number_isfinite, ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets, ref_src_lib_pyodide_runtime_js_call_pyodide_runpython, ref_src_lib_vfs_indexeddbvfs_js_call_handler, symbol_src_lib_notebook_formatrunmeta_js_function_formatduration, symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction

## Inferred Architecture
### Cross-Subsystem Flows

Inferred summary: Detected 81 inferred cross-subsystem flow(s).

- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-10-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/indexedDbVfs.js:68:0
- Inferred: **calls x5, contains x2**
  Confidence: high
  Source subsystem: subsystem-10-0-src-lib
  Target subsystem: subsystem-2-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_vfs_indexeddbvfs_js:contains:symbol_src_lib_pyodide_kernelsessionstore_js_function_canuseindexeddb:src/lib/vfs/indexedDbVfs.js:22:0, edge:file_src_lib_vfs_indexeddbvfs_js:contains:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:src/lib/vfs/indexedDbVfs.js:26:0, edge:file_src_lib_vfs_indexeddbvfs_js:imports:ref_src_lib_pyodide_kernelsessionstore_js_import_app_environment:src/lib/vfs/indexedDbVfs.js:1:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_db_transaction:src/lib/vfs/indexedDbVfs.js:63:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise:src/lib/vfs/indexedDbVfs.js:62:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/vfs/indexedDbVfs.js:68:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_resolve:src/lib/vfs/indexedDbVfs.js:66:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:src/lib/vfs/indexedDbVfs.js:58:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-10-0-src-lib
  Target subsystem: subsystem-5-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_vfs_indexeddbvfs_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/vfs/indexedDbVfs.js:92:0
- Inferred: **imports x2**
  Confidence: medium
  Source subsystem: subsystem-10-0-src-lib
  Target subsystem: subsystem-7-0-src-lib
  Relation: imports
  Evidence: edge:file_src_lib_vfs_indexeddbvfs_js:imports:file_src_lib_vfs_vfstree_js:src/lib/vfs/indexedDbVfs.js:20:0, edge:file_src_lib_vfs_indexeddbvfs_js:imports:file_src_lib_vfs_vfstree_js:src/lib/vfs/indexedDbVfs.js:2:0
- Inferred: **imports x1**
  Confidence: medium
  Source subsystem: subsystem-12-0-tests
  Target subsystem: subsystem-11-0-src-lib
  Relation: imports
  Evidence: edge:file_tests_formatrunmeta_test_js:imports:file_src_lib_notebook_formatrunmeta_js:tests/formatRunMeta.test.js:3:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-12-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/formatRunMeta.test.js:11:0, edge:file_tests_formatrunmeta_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/formatRunMeta.test.js:5:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-13-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_editor_pyrightbridge_js:calls:ref_src_lib_editor_monacosetup_js_call_attachpyrighttoeditor:src/lib/editor/pyrightBridge.js:38:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-14-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_layout_panellayout_js_function_clamppanelwidth:calls:ref_src_lib_editor_monacosetup_js_call_math_max:src/lib/layout/panelLayout.js:17:0, edge:symbol_src_lib_layout_panellayout_js_function_clamppanelwidth:calls:ref_src_lib_editor_monacosetup_js_call_math_min:src/lib/layout/panelLayout.js:17:0
- Inferred: **calls x7, imports x2**
  Confidence: high
  Source subsystem: subsystem-15-0-tests
  Target subsystem: subsystem-12-0-tests
  Relation: calls
  Evidence: edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:26:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:27:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:28:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:37:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:38:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/jupyterFormat.test.js:42:0, edge:file_tests_jupyterformat_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_ok:tests/jupyterFormat.test.js:41:0, edge:file_tests_jupyterformat_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/jupyterFormat.test.js:1:0, edge:file_tests_jupyterformat_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/jupyterFormat.test.js:2:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-15-0-tests
  Target subsystem: subsystem-14-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_layout_panellayout_js_call_json_stringify:tests/jupyterFormat.test.js:39:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-15-0-tests
  Target subsystem: subsystem-4-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_print:tests/jupyterFormat.test.js:21:0, edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_print:tests/jupyterFormat.test.js:28:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-15-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/jupyterFormat.test.js:11:0, edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/jupyterFormat.test.js:15:0, edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/jupyterFormat.test.js:31:0
- Inferred: **calls x62**
  Confidence: low
  Source subsystem: subsystem-16-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_dottednamebeforecursor:src/lib/editor/monacoSetup.js:131:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_extra_push:src/lib/editor/monacoSetup.js:109:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_extra_push:src/lib/editor/monacoSetup.js:121:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_extra_push:src/lib/editor/monacoSetup.js:134:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_getdynamicpythoncompletions:src/lib/editor/monacoSetup.js:102:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_importablemodulesuggestions:src/lib/editor/monacoSetup.js:108:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_importcontext:src/lib/editor/monacoSetup.js:106:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_membersformodule:src/lib/editor/monacoSetup.js:120:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_membersformodule:src/lib/editor/monacoSetup.js:133:0, edge:symbol_src_lib_editor_monacosetup_js_function_registernotebooktheme:calls:ref_src_lib_editor_monacosetup_js_call_editor_definetheme:src/lib/editor/monacoSetup.js:27:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_allcompletions_map:src/lib/editor/monacoSetup.js:178:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_attachpyrighttoeditor:src/lib/editor/monacoSetup.js:370:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_changedisposable_dispose:src/lib/editor/monacoSetup.js:378:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_createmonacoeditor:src/lib/editor/monacoSetup.js:306:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_dispose:src/lib/editor/monacoSetup.js:255:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_addaction:src/lib/editor/monacoSetup.js:358:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_create:src/lib/editor/monacoSetup.js:310:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_dispose:src/lib/editor/monacoSetup.js:380:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_getvalue:src/lib/editor/monacoSetup.js:355:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_getvalue:src/lib/editor/monacoSetup.js:375:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_getvalue:src/lib/editor/monacoSetup.js:383:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_ondidchangemodelcontent:src/lib/editor/monacoSetup.js:354:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_ondidcontentsizechange:src/lib/editor/monacoSetup.js:352:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_settheme:src/lib/editor/monacoSetup.js:293:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_setvalue:src/lib/editor/monacoSetup.js:384:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_editor_updateoptions:src/lib/editor/monacoSetup.js:388:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_ensuremonacoready:src/lib/editor/monacoSetup.js:273:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_ensuremonacoready:src/lib/editor/monacoSetup.js:307:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/editor/monacoSetup.js:308:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_exec:src/lib/editor/monacoSetup.js:239:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_includes:src/lib/editor/monacoSetup.js:182:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_languages_registercompletionitemprovider:src/lib/editor/monacoSetup.js:159:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_languages_registerhoverprovider:src/lib/editor/monacoSetup.js:209:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_languages_registersignaturehelpprovider:src/lib/editor/monacoSetup.js:230:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_lineprefix_endswith:src/lib/editor/monacoSetup.js:194:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_lineprefix_slice:src/lib/editor/monacoSetup.js:195:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_loader_config:src/lib/editor/monacoSetup.js:277:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_loader_init:src/lib/editor/monacoSetup.js:282:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/editor/monacoSetup.js:196:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_model_getvalueinrange:src/lib/editor/monacoSetup.js:170:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_model_getvalueinrange:src/lib/editor/monacoSetup.js:233:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_model_getwordatposition:src/lib/editor/monacoSetup.js:211:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_model_getworduntilposition:src/lib/editor/monacoSetup.js:162:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_monaco_range:src/lib/editor/monacoSetup.js:216:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_objectname_split:src/lib/editor/monacoSetup.js:196:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_pop:src/lib/editor/monacoSetup.js:195:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_providecompletionitems:src/lib/editor/monacoSetup.js:161:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_providehover:src/lib/editor/monacoSetup.js:210:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_providesignaturehelp:src/lib/editor/monacoSetup.js:232:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_runaction_dispose:src/lib/editor/monacoSetup.js:379:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_setreadonly:src/lib/editor/monacoSetup.js:387:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_setvalue:src/lib/editor/monacoSetup.js:382:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_sizedisposable_dispose:src/lib/editor/monacoSetup.js:377:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_split:src/lib/editor/monacoSetup.js:195:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_suggestions_push:src/lib/editor/monacoSetup.js:192:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_suggestions_push:src/lib/editor/monacoSetup.js:202:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/editor/monacoSetup.js:195:0, edge:symbol_src_lib_editor_monacosetup_js_function_registerpythonlanguageconfiguration:calls:ref_src_lib_editor_monacosetup_js_call_languages_setlanguageconfiguration:src/lib/editor/monacoSetup.js:58:0, edge:symbol_src_lib_editor_monacosetup_js_function_resize:calls:ref_src_lib_editor_monacosetup_js_call_editor_getcontentheight:src/lib/editor/monacoSetup.js:347:0, edge:symbol_src_lib_editor_monacosetup_js_function_resize:calls:ref_src_lib_editor_monacosetup_js_call_editor_layout:src/lib/editor/monacoSetup.js:349:0, edge:symbol_src_lib_editor_monacosetup_js_function_resize:calls:ref_src_lib_editor_monacosetup_js_call_math_max:src/lib/editor/monacoSetup.js:347:0, edge:symbol_src_lib_editor_monacosetup_js_function_resize:calls:ref_src_lib_editor_monacosetup_js_call_math_min:src/lib/editor/monacoSetup.js:347:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-2-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/kernelSessionStore.js:55:0, edge:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/indexedDbVfs.js:44:0
- Inferred: **imports x2**
  Confidence: medium
  Source subsystem: subsystem-2-0-src-lib
  Target subsystem: subsystem-27-0-src-lib
  Relation: imports
  Evidence: edge:file_src_lib_pyodide_kernelsessionstore_js:imports:file_src_lib_pyodide_kernelsessionkeys_js:src/lib/pyodide/kernelSessionStore.js:2:0, edge:file_src_lib_pyodide_kernelsessionstore_js:imports:file_src_lib_pyodide_kernelsessionkeys_js:src/lib/pyodide/kernelSessionStore.js:7:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-2-0-src-lib
  Target subsystem: subsystem-5-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_pyodide_kernelsessionstore_js_function_normalizerecord:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/kernelSessionStore.js:101:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-20-0-tests
  Target subsystem: subsystem-10-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_vfs_test_js:calls:ref_src_lib_vfs_indexeddbvfs_js_call_emptysnapshot:tests/vfs.test.js:11:0, edge:file_tests_vfs_test_js:calls:ref_src_lib_vfs_indexeddbvfs_js_call_emptysnapshot:tests/vfs.test.js:18:0
- Inferred: **calls x4, imports x2**
  Confidence: high
  Source subsystem: subsystem-20-0-tests
  Target subsystem: subsystem-12-0-tests
  Relation: calls
  Evidence: edge:file_tests_vfs_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/vfs.test.js:14:0, edge:file_tests_vfs_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/vfs.test.js:23:0, edge:file_tests_vfs_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/vfs.test.js:24:0, edge:file_tests_vfs_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_ok:tests/vfs.test.js:12:0, edge:file_tests_vfs_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/vfs.test.js:1:0, edge:file_tests_vfs_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/vfs.test.js:2:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-20-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_vfs_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/vfs.test.js:10:0, edge:file_tests_vfs_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/vfs.test.js:17:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-20-0-tests
  Target subsystem: subsystem-7-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_vfs_test_js:calls:ref_src_lib_vfs_vfstree_js_call_nodes_find:tests/vfs.test.js:13:0
- Inferred: **calls x8**
  Confidence: low
  Source subsystem: subsystem-21-0-src-lib
  Target subsystem: subsystem-0-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_document_queryselector:src/lib/pyodide/runtime.js:41:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener:src/lib/pyodide/runtime.js:43:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener:src/lib/pyodide/runtime.js:44:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_head_append:src/lib/pyodide/runtime.js:58:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_parsed_filter:src/lib/pyodide/runtime.js:252:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:244:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:249:0, edge:symbol_src_lib_pyodide_runtime_js_function_resetpythonruntime:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:223:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-21-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:35:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:46:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:57:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-21-0-src-lib
  Target subsystem: subsystem-14-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:250:0
- Inferred: **calls x6**
  Confidence: low
  Source subsystem: subsystem-21-0-src-lib
  Target subsystem: subsystem-2-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise:src/lib/pyodide/runtime.js:40:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise_resolve:src/lib/pyodide/runtime.js:38:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/pyodide/runtime.js:46:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/pyodide/runtime.js:57:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_resolve:src/lib/pyodide/runtime.js:43:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_resolve:src/lib/pyodide/runtime.js:56:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-21-0-src-lib
  Target subsystem: subsystem-3-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_nb_drain_figure_pngs:src/lib/pyodide/runtime.js:249:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_plt_get_fignums:src/lib/pyodide/runtime.js:246:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_plt_show:src/lib/pyodide/runtime.js:247:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-21-0-src-lib
  Target subsystem: subsystem-5-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_notebook_jupyterformat_js_call_document_createelement:src/lib/pyodide/runtime.js:52:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:251:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-23-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/notebook/parseNotebook.js:22:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-23-0-src-lib
  Target subsystem: subsystem-14-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/notebook/parseNotebook.js:20:0, edge:symbol_src_lib_notebook_parsenotebook_js_function_serializenotebook:calls:ref_src_lib_layout_panellayout_js_call_json_stringify:src/lib/notebook/parseNotebook.js:51:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-23-0-src-lib
  Target subsystem: subsystem-4-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_editor_pythonbuiltins_js_call_print:src/lib/notebook/parseNotebook.js:39:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-23-0-src-lib
  Target subsystem: subsystem-5-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/notebook/parseNotebook.js:21:0, edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_notebook_jupyterformat_js_call_cells_map:src/lib/notebook/parseNotebook.js:26:0
- Inferred: **imports x2, calls x1**
  Confidence: high
  Source subsystem: subsystem-25-0-tests
  Target subsystem: subsystem-12-0-tests
  Relation: imports
  Evidence: edge:file_tests_markdown_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_match:tests/markdown.test.js:7:0, edge:file_tests_markdown_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/markdown.test.js:1:0, edge:file_tests_markdown_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/markdown.test.js:2:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-25-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_markdown_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/markdown.test.js:5:0
- Inferred: **imports x1**
  Confidence: medium
  Source subsystem: subsystem-25-0-tests
  Target subsystem: subsystem-8-0-src-lib
  Relation: imports
  Evidence: edge:file_tests_markdown_test_js:imports:file_src_lib_markdown_rendermarkdown_js:tests/markdown.test.js:3:0
- Inferred: **calls x4, imports x2**
  Confidence: high
  Source subsystem: subsystem-26-0-tests
  Target subsystem: subsystem-12-0-tests
  Relation: calls
  Evidence: edge:file_tests_notebook_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/notebook.test.js:19:0, edge:file_tests_notebook_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/notebook.test.js:7:0, edge:file_tests_notebook_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/notebook.test.js:8:0, edge:file_tests_notebook_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/notebook.test.js:9:0, edge:file_tests_notebook_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/notebook.test.js:1:0, edge:file_tests_notebook_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/notebook.test.js:2:0
- Inferred: **imports x1**
  Confidence: medium
  Source subsystem: subsystem-26-0-tests
  Target subsystem: subsystem-23-0-src-lib
  Relation: imports
  Evidence: edge:file_tests_notebook_test_js:imports:file_src_lib_notebook_parsenotebook_js:tests/notebook.test.js:3:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-26-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_notebook_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/notebook.test.js:12:0, edge:file_tests_notebook_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/notebook.test.js:5:0
- Inferred: **imports x2, calls x1**
  Confidence: high
  Source subsystem: subsystem-28-0-tests
  Target subsystem: subsystem-12-0-tests
  Relation: imports
  Evidence: edge:file_tests_kernelsessionkeys_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_match:tests/kernelSessionKeys.test.js:7:0, edge:file_tests_kernelsessionkeys_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/kernelSessionKeys.test.js:1:0, edge:file_tests_kernelsessionkeys_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/kernelSessionKeys.test.js:2:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-28-0-tests
  Target subsystem: subsystem-2-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_kernelsessionkeys_test_js:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_sessionstoragekey:tests/kernelSessionKeys.test.js:6:0, edge:file_tests_kernelsessionkeys_test_js:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_sessionstoragekey:tests/kernelSessionKeys.test.js:8:0
- Inferred: **imports x1**
  Confidence: medium
  Source subsystem: subsystem-28-0-tests
  Target subsystem: subsystem-27-0-src-lib
  Relation: imports
  Evidence: edge:file_tests_kernelsessionkeys_test_js:imports:file_src_lib_pyodide_kernelsessionkeys_js:tests/kernelSessionKeys.test.js:3:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-28-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_kernelsessionkeys_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/kernelSessionKeys.test.js:5:0
- Inferred: **calls x3, imports x2**
  Confidence: high
  Source subsystem: subsystem-29-0-tests
  Target subsystem: subsystem-12-0-tests
  Relation: calls
  Evidence: edge:file_tests_panellayout_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/panelLayout.test.js:12:0, edge:file_tests_panellayout_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/panelLayout.test.js:13:0, edge:file_tests_panellayout_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/panelLayout.test.js:14:0, edge:file_tests_panellayout_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/panelLayout.test.js:1:0, edge:file_tests_panellayout_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/panelLayout.test.js:2:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-29-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_panellayout_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/panelLayout.test.js:11:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-3-0-src-lib
  Target subsystem: subsystem-4-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_pyodide_notebookpackages_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/notebookPackages.js:29:0, edge:file_src_lib_pyodide_notebookpackages_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/notebookPackages.js:47:0
- Inferred: **contains x4**
  Confidence: high
  Source subsystem: subsystem-30-0-src-lib
  Target subsystem: subsystem-16-0-src-lib
  Relation: contains
  Evidence: edge:file_src_lib_editor_monacosetup_js:contains:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:src/lib/editor/monacoSetup.js:101:0, edge:file_src_lib_editor_monacosetup_js:contains:symbol_src_lib_editor_monacosetup_js_function_registernotebooktheme:src/lib/editor/monacoSetup.js:26:0, edge:file_src_lib_editor_monacosetup_js:contains:symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures:src/lib/editor/monacoSetup.js:150:0, edge:file_src_lib_editor_monacosetup_js:contains:symbol_src_lib_editor_monacosetup_js_function_registerpythonlanguageconfiguration:src/lib/editor/monacoSetup.js:57:0
- Inferred: **imports x1**
  Confidence: medium
  Source subsystem: subsystem-30-0-src-lib
  Target subsystem: subsystem-19-0-src-lib
  Relation: imports
  Evidence: edge:file_src_lib_editor_monacosetup_js:imports:file_src_lib_editor_monacocompletionstate_js:src/lib/editor/monacoSetup.js:2:0
- Inferred: **imports x1**
  Confidence: high
  Source subsystem: subsystem-30-0-src-lib
  Target subsystem: subsystem-36-0-src-lib
  Relation: imports
  Evidence: edge:file_src_lib_editor_monacosetup_js:imports:ref_src_lib_editor_monacosetup_js_import_monaco_editor_loader:src/lib/editor/monacoSetup.js:1:0
- Inferred: **calls x110**
  Confidence: low
  Source subsystem: subsystem-31-0-src-lib
  Target subsystem: subsystem-0-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_base64_b64decode:src/lib/pyodide/runtime.js:175:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_base64_b64decode:src/lib/pyodide/runtime.js:196:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:278:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:287:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:138:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:147:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_dir:src/lib/pyodide/runtime.js:99:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurenotebookpackages:src/lib/pyodide/runtime.js:21:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurenotebookpackages:src/lib/pyodide/runtime.js:75:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:265:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:309:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:336:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:368:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:390:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:422:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_ensurepythonruntime:src/lib/pyodide/runtime.js:66:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environ_items:src/lib/pyodide/runtime.js:122:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environproxy_destroy:src/lib/pyodide/runtime.js:321:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_environproxy_tojs:src/lib/pyodide/runtime.js:318:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_exportkernelcheckpoint:src/lib/pyodide/runtime.js:367:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_failed_append:src/lib/pyodide/runtime.js:184:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_failed_append:src/lib/pyodide/runtime.js:212:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_getattr:src/lib/pyodide/runtime.js:129:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:109:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:142:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:158:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:181:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals:src/lib/pyodide/runtime.js:209:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:392:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:424:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globals_set:src/lib/pyodide/runtime.js:425:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globalsproxy_destroy:src/lib/pyodide/runtime.js:320:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_globalsproxy_tojs:src/lib/pyodide/runtime.js:315:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_importkernelcheckpoint:src/lib/pyodide/runtime.js:389:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_in:src/lib/pyodide/runtime.js:191:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_inspectpythoncompletions:src/lib/pyodide/runtime.js:335:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_inspectpythonsession:src/lib/pyodide/runtime.js:308:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:310:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:337:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:369:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:391:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:423:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:76:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_installsessionhelpers:src/lib/pyodide/runtime.js:91:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_interpreter:src/lib/pyodide/runtime.js:220:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:109:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:142:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_items:src/lib/pyodide/runtime.js:158:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_k_split:src/lib/pyodide/runtime.js:130:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_k_startswith:src/lib/pyodide/runtime.js:130:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_keys:src/lib/pyodide/runtime.js:200:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_loadpyodide:src/lib/pyodide/runtime.js:74:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_lower:src/lib/pyodide/runtime.js:191:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_mergekernelcheckpoint:src/lib/pyodide/runtime.js:421:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_modules_items:src/lib/pyodide/runtime.js:134:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_modules_keys:src/lib/pyodide/runtime.js:130:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:110:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:135:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:143:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:159:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_name_startswith:src/lib/pyodide/runtime.js:203:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_completion_snapshot:src/lib/pyodide/runtime.js:124:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_completion_snapshot:src/lib/pyodide/runtime.js:339:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_export_pickle_checkpoint:src/lib/pyodide/runtime.js:153:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_export_pickle_checkpoint:src/lib/pyodide/runtime.js:370:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_import_pickle_checkpoint:src/lib/pyodide/runtime.js:168:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_import_pickle_checkpoint:src/lib/pyodide/runtime.js:394:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_environ:src/lib/pyodide/runtime.js:121:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_environ:src/lib/pyodide/runtime.js:313:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:107:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:200:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_list_user_globals:src/lib/pyodide/runtime.js:312:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_merge_pickle_checkpoint:src/lib/pyodide/runtime.js:187:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_nb_merge_pickle_checkpoint:src/lib/pyodide/runtime.js:428:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_order:src/lib/pyodide/runtime.js:447:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_payload_items:src/lib/pyodide/runtime.js:179:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_payload_items:src/lib/pyodide/runtime.js:202:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_dumps:src/lib/pyodide/runtime.js:162:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_dumps:src/lib/pyodide/runtime.js:165:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:175:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:181:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:196:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pickle_loads:src/lib/pyodide/runtime.js:209:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:275:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:312:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:313:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:339:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:370:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:394:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:396:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:427:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_runpython:src/lib/pyodide/runtime.js:431:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_setstderr:src/lib/pyodide/runtime.js:272:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_pyodide_setstdout:src/lib/pyodide/runtime.js:271:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_replaykerneljournal:src/lib/pyodide/runtime.js:451:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_repr:src/lib/pyodide/runtime.js:113:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_restored_append:src/lib/pyodide/runtime.js:182:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_restored_append:src/lib/pyodide/runtime.js:210:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runpythonsource:src/lib/pyodide/runtime.js:264:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runpythonsource:src/lib/pyodide/runtime.js:455:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_runtime:src/lib/pyodide/runtime.js:260:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_skipped_append:src/lib/pyodide/runtime.js:206:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_join:src/lib/pyodide/runtime.js:282:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_join:src/lib/pyodide/runtime.js:291:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stderr_push:src/lib/pyodide/runtime.js:272:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_join:src/lib/pyodide/runtime.js:281:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_join:src/lib/pyodide/runtime.js:290:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_stdout_push:src/lib/pyodide/runtime.js:271:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_x_startswith:src/lib/pyodide/runtime.js:138:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_x_startswith:src/lib/pyodide/runtime.js:147:0
- Inferred: **calls x5**
  Confidence: low
  Source subsystem: subsystem-31-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:72:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:281:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:282:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:290:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:291:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-31-0-src-lib
  Target subsystem: subsystem-13-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pyrightbridge_js_call_async:src/lib/pyodide/runtime.js:23:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pyrightbridge_js_call_async:src/lib/pyodide/runtime.js:68:0
- Inferred: **calls x4**
  Confidence: low
  Source subsystem: subsystem-31-0-src-lib
  Target subsystem: subsystem-14-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:341:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:371:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:398:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:437:0
- Inferred: **contains x4, calls x3**
  Confidence: high
  Source subsystem: subsystem-31-0-src-lib
  Target subsystem: subsystem-21-0-src-lib
  Relation: contains
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:src/lib/pyodide/runtime.js:69:0, edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:277:0, edge:file_src_lib_pyodide_runtime_js:calls:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:286:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:src/lib/pyodide/runtime.js:33:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:src/lib/pyodide/runtime.js:242:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_ispythonruntimeready:src/lib/pyodide/runtime.js:353:0, edge:file_src_lib_pyodide_runtime_js:contains:symbol_src_lib_pyodide_runtime_js_function_resetpythonruntime:src/lib/pyodide/runtime.js:222:0
- Inferred: **calls x13**
  Confidence: low
  Source subsystem: subsystem-31-0-src-lib
  Target subsystem: subsystem-3-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_base64_b64encode:src/lib/pyodide/runtime.js:165:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_decode:src/lib/pyodide/runtime.js:165:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:151:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:166:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:177:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:185:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:198:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:213:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_loadnotebookpackages:src/lib/pyodide/runtime.js:24:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_nb_drain_figure_pngs:src/lib/pyodide/runtime.js:275:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_plt_show:src/lib/pyodide/runtime.js:235:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_pyodide_runpythonasync:src/lib/pyodide/runtime.js:276:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_pyodide_runpythonasync:src/lib/pyodide/runtime.js:94:0
- Inferred: **calls x14**
  Confidence: low
  Source subsystem: subsystem-31-0-src-lib
  Target subsystem: subsystem-4-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_isinstance:src/lib/pyodide/runtime.js:146:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_len:src/lib/pyodide/runtime.js:116:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_len:src/lib/pyodide/runtime.js:166:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/runtime.js:134:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/runtime.js:158:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_set:src/lib/pyodide/runtime.js:129:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_set:src/lib/pyodide/runtime.js:200:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_set:src/lib/pyodide/runtime.js:99:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_sorted:src/lib/pyodide/runtime.js:128:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_str:src/lib/pyodide/runtime.js:122:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_str:src/lib/pyodide/runtime.js:177:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_str:src/lib/pyodide/runtime.js:191:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_str:src/lib/pyodide/runtime.js:198:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_type:src/lib/pyodide/runtime.js:115:0
- Inferred: **calls x6**
  Confidence: low
  Source subsystem: subsystem-31-0-src-lib
  Target subsystem: subsystem-5-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:345:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:401:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:402:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:439:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:440:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:441:0
- Inferred: **calls x6**
  Confidence: low
  Source subsystem: subsystem-34-0-tests
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_dottednamebeforecursor:tests/pythonModuleIndex.test.js:10:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_dottednamebeforecursor:tests/pythonModuleIndex.test.js:11:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_importcontext:tests/pythonModuleIndex.test.js:15:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_importcontext:tests/pythonModuleIndex.test.js:16:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_includes:tests/pythonModuleIndex.test.js:23:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_membersformodule:tests/pythonModuleIndex.test.js:23:0
- Inferred: **calls x3, imports x2**
  Confidence: high
  Source subsystem: subsystem-34-0-tests
  Target subsystem: subsystem-12-0-tests
  Relation: calls
  Evidence: edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/pythonModuleIndex.test.js:10:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_equal:tests/pythonModuleIndex.test.js:11:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_ok:tests/pythonModuleIndex.test.js:23:0, edge:file_tests_pythonmoduleindex_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/pythonModuleIndex.test.js:1:0, edge:file_tests_pythonmoduleindex_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/pythonModuleIndex.test.js:2:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-34-0-tests
  Target subsystem: subsystem-15-0-tests
  Relation: calls
  Evidence: edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_jupyterformat_test_js_call_assert_deepequal:tests/pythonModuleIndex.test.js:15:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_jupyterformat_test_js_call_assert_deepequal:tests/pythonModuleIndex.test.js:16:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-34-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/pythonModuleIndex.test.js:14:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/pythonModuleIndex.test.js:22:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/pythonModuleIndex.test.js:9:0
- Inferred: **imports x2, calls x1**
  Confidence: high
  Source subsystem: subsystem-35-0-tests
  Target subsystem: subsystem-12-0-tests
  Relation: imports
  Evidence: edge:file_tests_randomid_test_js:calls:ref_tests_formatrunmeta_test_js_call_assert_match:tests/randomId.test.js:7:0, edge:file_tests_randomid_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_assert_strict:tests/randomId.test.js:1:0, edge:file_tests_randomid_test_js:imports:ref_tests_formatrunmeta_test_js_import_node_test:tests/randomId.test.js:2:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-35-0-tests
  Target subsystem: subsystem-28-0-tests
  Relation: calls
  Evidence: edge:file_tests_randomid_test_js:calls:ref_tests_kernelsessionkeys_test_js_call_assert_notequal:tests/randomId.test.js:13:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-35-0-tests
  Target subsystem: subsystem-5-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_randomid_test_js:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:tests/randomId.test.js:11:0, edge:file_tests_randomid_test_js:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:tests/randomId.test.js:12:0, edge:file_tests_randomid_test_js:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:tests/randomId.test.js:6:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-35-0-tests
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:file_tests_randomid_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/randomId.test.js:10:0, edge:file_tests_randomid_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/randomId.test.js:5:0
- Inferred: **imports x1**
  Confidence: medium
  Source subsystem: subsystem-35-0-tests
  Target subsystem: subsystem-9-0-src-lib
  Relation: imports
  Evidence: edge:file_tests_randomid_test_js:imports:file_src_lib_utils_randomid_js:tests/randomId.test.js:3:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-4-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_editor_pythonbuiltins_js:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/editor/pythonBuiltins.js:81:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-5-0-src-lib
  Target subsystem: subsystem-14-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_notebook_jupyterformat_js_function_parseimportednotebook:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/notebook/jupyterFormat.js:100:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-5-0-src-lib
  Target subsystem: subsystem-4-0-src-lib
  Relation: calls
  Evidence: edge:file_src_lib_notebook_jupyterformat_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_filter:src/lib/notebook/jupyterFormat.js:46:0
- Inferred: **imports x1**
  Confidence: medium
  Source subsystem: subsystem-5-0-src-lib
  Target subsystem: subsystem-9-0-src-lib
  Relation: imports
  Evidence: edge:file_src_lib_notebook_jupyterformat_js:imports:file_src_lib_utils_randomid_js:src/lib/notebook/jupyterFormat.js:5:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-6-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_editor_pythonmoduleindex_js_function_dottednamebeforecursor:calls:ref_src_lib_editor_monacosetup_js_call_lineprefix_endswith:src/lib/editor/pythonModuleIndex.js:123:0, edge:symbol_src_lib_editor_pythonmoduleindex_js_function_dottednamebeforecursor:calls:ref_src_lib_editor_monacosetup_js_call_lineprefix_slice:src/lib/editor/pythonModuleIndex.js:124:0, edge:symbol_src_lib_editor_pythonmoduleindex_js_function_importablemodulesuggestions:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/editor/pythonModuleIndex.js:170:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-6-0-src-lib
  Target subsystem: subsystem-4-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_editor_pythonmoduleindex_js_function_importablemodulesuggestions:calls:ref_src_lib_editor_pythonbuiltins_js_call_set:src/lib/editor/pythonModuleIndex.js:171:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-7-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_writefile:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/vfsTree.js:80:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-7-0-src-lib
  Target subsystem: subsystem-14-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_ensurestarternotebook:calls:ref_src_lib_layout_panellayout_js_call_json_stringify:src/lib/vfs/vfsTree.js:108:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-7-0-src-lib
  Target subsystem: subsystem-2-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_createnode:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_date_now:src/lib/vfs/vfsTree.js:41:0, edge:symbol_src_lib_vfs_vfstree_js_function_emptysnapshot:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_date_now:src/lib/vfs/vfsTree.js:12:0, edge:symbol_src_lib_vfs_vfstree_js_function_writefile:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_date_now:src/lib/vfs/vfsTree.js:83:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-7-0-src-lib
  Target subsystem: subsystem-4-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_ensurestarternotebook:calls:ref_src_lib_editor_pythonbuiltins_js_call_print:src/lib/vfs/vfsTree.js:115:0, edge:symbol_src_lib_vfs_vfstree_js_function_listchildren:calls:ref_src_lib_editor_pythonbuiltins_js_call_filter:src/lib/vfs/vfsTree.js:63:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-7-0-src-lib
  Target subsystem: subsystem-5-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_createnode:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:src/lib/vfs/vfsTree.js:37:0, edge:symbol_src_lib_vfs_vfstree_js_function_emptysnapshot:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:src/lib/vfs/vfsTree.js:11:0, edge:symbol_src_lib_vfs_vfstree_js_function_ensurestarternotebook:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:src/lib/vfs/vfsTree.js:113:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-7-0-src-lib
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_ensurestarternotebook:calls:ref_src_lib_editor_pythonmoduleindex_js_call_sort:src/lib/vfs/vfsTree.js:97:0, edge:symbol_src_lib_vfs_vfstree_js_function_listchildren:calls:ref_src_lib_editor_pythonmoduleindex_js_call_sort:src/lib/vfs/vfsTree.js:64:0
- Inferred: **imports x1**
  Confidence: medium
  Source subsystem: subsystem-7-0-src-lib
  Target subsystem: subsystem-9-0-src-lib
  Relation: imports
  Evidence: edge:file_src_lib_vfs_vfstree_js:imports:file_src_lib_utils_randomid_js:src/lib/vfs/vfsTree.js:1:0
- Inferred: **calls x4**
  Confidence: low
  Source subsystem: subsystem-8-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/markdown/renderMarkdown.js:14:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/markdown/renderMarkdown.js:28:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/markdown/renderMarkdown.js:33:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_monacosetup_js_call_split:src/lib/markdown/renderMarkdown.js:26:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-8-0-src-lib
  Target subsystem: subsystem-4-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonbuiltins_js_call_filter:src/lib/markdown/renderMarkdown.js:27:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonbuiltins_js_call_filter:src/lib/markdown/renderMarkdown.js:35:0
- Inferred: **calls x3**
  Confidence: low
  Source subsystem: subsystem-8-0-src-lib
  Target subsystem: subsystem-6-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:src/lib/markdown/renderMarkdown.js:18:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:src/lib/markdown/renderMarkdown.js:24:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:src/lib/markdown/renderMarkdown.js:27:0
- Inferred: **calls x1**
  Confidence: low
  Source subsystem: subsystem-9-0-src-lib
  Target subsystem: subsystem-1-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_utils_randomid_js_function_randomid:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/utils/randomId.js:19:0
- Inferred: **calls x2**
  Confidence: low
  Source subsystem: subsystem-9-0-src-lib
  Target subsystem: subsystem-8-0-src-lib
  Relation: calls
  Evidence: edge:symbol_src_lib_utils_randomid_js_function_randomid:calls:ref_src_lib_markdown_rendermarkdown_js_call_join:src/lib/utils/randomId.js:19:0, edge:symbol_src_lib_utils_randomid_js_function_randomid:calls:ref_src_lib_markdown_rendermarkdown_js_call_replace:src/lib/utils/randomId.js:22:0

Evidence: edge:file_src_lib_vfs_indexeddbvfs_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/vfs/indexedDbVfs.js:92:0, edge:file_src_lib_vfs_indexeddbvfs_js:contains:symbol_src_lib_pyodide_kernelsessionstore_js_function_canuseindexeddb:src/lib/vfs/indexedDbVfs.js:22:0, edge:file_src_lib_vfs_indexeddbvfs_js:contains:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:src/lib/vfs/indexedDbVfs.js:26:0, edge:file_src_lib_vfs_indexeddbvfs_js:imports:file_src_lib_vfs_vfstree_js:src/lib/vfs/indexedDbVfs.js:20:0, edge:file_src_lib_vfs_indexeddbvfs_js:imports:file_src_lib_vfs_vfstree_js:src/lib/vfs/indexedDbVfs.js:2:0, edge:file_src_lib_vfs_indexeddbvfs_js:imports:ref_src_lib_pyodide_kernelsessionstore_js_import_app_environment:src/lib/vfs/indexedDbVfs.js:1:0, edge:file_tests_formatrunmeta_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/formatRunMeta.test.js:11:0, edge:file_tests_formatrunmeta_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/formatRunMeta.test.js:5:0, edge:file_tests_formatrunmeta_test_js:imports:file_src_lib_notebook_formatrunmeta_js:tests/formatRunMeta.test.js:3:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/indexedDbVfs.js:68:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_db_transaction:src/lib/vfs/indexedDbVfs.js:63:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise:src/lib/vfs/indexedDbVfs.js:62:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/vfs/indexedDbVfs.js:68:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_resolve:src/lib/vfs/indexedDbVfs.js:66:0, edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:src/lib/vfs/indexedDbVfs.js:58:0

### Documentation Alignments

Inferred summary: Detected 0 architecture theme(s) from repository docs.

No grounded items were available for this section.

## Questions Before Architecture Generation
Ask these before finalizing the architecture deliverable:
- What kind of architecture output do you want next: a high-level diagram, a deployment view, a sequence flow, or a deeper written architecture?
- Which user journeys, business workflows, or API flows matter most for this architecture pass?
- What operational constraints should shape the design, such as scale, latency, reliability, compliance, tenancy, or geographic requirements?
- Which external systems, third-party integrations, or data providers are in scope and which are intentionally out of scope?
- Are there planned changes, migrations, or target-state boundaries that differ from the current codebase structure?
- Which inferred components, names, or boundaries should be treated as tentative until you confirm them?

## Diagram / Image Generation Instructions
- Ask artifact type first: True
- Supported artifact options: high-level architecture, low-level architecture, component breakdown, user flow diagram, sequence / interaction view, custom request
- Ask visual style first: True
- Supported visual style options: clean architecture diagram, swimlane flow, sequence view, annotated component map, presentation-ready infographic, custom style
- Must wait for answers before final output: True
- Generate image when supported: True
- Fallback to render-ready diagram spec when image generation is unavailable: True

## Open Questions / Uncertainty
### Open Questions

- Inferred: **Does `subsystem-10-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-10-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_vfs_indexeddbvfs_js_function_runtransaction:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/indexedDbVfs.js:68:0
- Inferred: **Does `subsystem-10-0-src-lib` really depend on `subsystem-5-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-10-0-src-lib, subsystem-5-0-src-lib
  Evidence: edge:file_src_lib_vfs_indexeddbvfs_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/vfs/indexedDbVfs.js:92:0
- Inferred: **Does `subsystem-12-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-12-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_formatrunmeta_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/formatRunMeta.test.js:11:0, edge:file_tests_formatrunmeta_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/formatRunMeta.test.js:5:0
- Inferred: **Does `subsystem-13-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-13-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:file_src_lib_editor_pyrightbridge_js:calls:ref_src_lib_editor_monacosetup_js_call_attachpyrighttoeditor:src/lib/editor/pyrightBridge.js:38:0
- Inferred: **Does `subsystem-14-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-14-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_layout_panellayout_js_function_clamppanelwidth:calls:ref_src_lib_editor_monacosetup_js_call_math_max:src/lib/layout/panelLayout.js:17:0, edge:symbol_src_lib_layout_panellayout_js_function_clamppanelwidth:calls:ref_src_lib_editor_monacosetup_js_call_math_min:src/lib/layout/panelLayout.js:17:0
- Inferred: **Does `subsystem-15-0-tests` really depend on `subsystem-14-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-15-0-tests, subsystem-14-0-src-lib
  Evidence: edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_layout_panellayout_js_call_json_stringify:tests/jupyterFormat.test.js:39:0
- Inferred: **Does `subsystem-15-0-tests` really depend on `subsystem-4-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-15-0-tests, subsystem-4-0-src-lib
  Evidence: edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_print:tests/jupyterFormat.test.js:21:0, edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_print:tests/jupyterFormat.test.js:28:0
- Inferred: **Does `subsystem-15-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-15-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/jupyterFormat.test.js:11:0, edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/jupyterFormat.test.js:15:0, edge:file_tests_jupyterformat_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/jupyterFormat.test.js:31:0
- Inferred: **Does `subsystem-16-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-16-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_dottednamebeforecursor:src/lib/editor/monacoSetup.js:131:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_extra_push:src/lib/editor/monacoSetup.js:109:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_extra_push:src/lib/editor/monacoSetup.js:121:0, edge:symbol_src_lib_editor_monacosetup_js_function_buildcontextualsuggestions:calls:ref_src_lib_editor_monacosetup_js_call_extra_push:src/lib/editor/monacoSetup.js:134:0
- Inferred: **Does `subsystem-2-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-2-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/kernelSessionStore.js:55:0, edge:symbol_src_lib_pyodide_kernelsessionstore_js_function_opendatabase:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/indexedDbVfs.js:44:0
- Inferred: **Does `subsystem-2-0-src-lib` really depend on `subsystem-5-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-2-0-src-lib, subsystem-5-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_kernelsessionstore_js_function_normalizerecord:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/kernelSessionStore.js:101:0
- Inferred: **Does `subsystem-20-0-tests` really depend on `subsystem-10-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-20-0-tests, subsystem-10-0-src-lib
  Evidence: edge:file_tests_vfs_test_js:calls:ref_src_lib_vfs_indexeddbvfs_js_call_emptysnapshot:tests/vfs.test.js:11:0, edge:file_tests_vfs_test_js:calls:ref_src_lib_vfs_indexeddbvfs_js_call_emptysnapshot:tests/vfs.test.js:18:0
- Inferred: **Does `subsystem-20-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-20-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_vfs_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/vfs.test.js:10:0, edge:file_tests_vfs_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/vfs.test.js:17:0
- Inferred: **Does `subsystem-20-0-tests` really depend on `subsystem-7-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-20-0-tests, subsystem-7-0-src-lib
  Evidence: edge:file_tests_vfs_test_js:calls:ref_src_lib_vfs_vfstree_js_call_nodes_find:tests/vfs.test.js:13:0
- Inferred: **Does `subsystem-21-0-src-lib` really depend on `subsystem-0-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-21-0-src-lib, subsystem-0-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_document_queryselector:src/lib/pyodide/runtime.js:41:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener:src/lib/pyodide/runtime.js:43:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_existing_addeventlistener:src/lib/pyodide/runtime.js:44:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_runtime_js_call_head_append:src/lib/pyodide/runtime.js:58:0
- Inferred: **Does `subsystem-21-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-21-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:35:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:46:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:57:0
- Inferred: **Does `subsystem-21-0-src-lib` really depend on `subsystem-14-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-21-0-src-lib, subsystem-14-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:250:0
- Inferred: **Does `subsystem-21-0-src-lib` really depend on `subsystem-2-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-21-0-src-lib, subsystem-2-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise:src/lib/pyodide/runtime.js:40:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_promise_resolve:src/lib/pyodide/runtime.js:38:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/pyodide/runtime.js:46:0, edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_reject:src/lib/pyodide/runtime.js:57:0
- Inferred: **Does `subsystem-21-0-src-lib` really depend on `subsystem-3-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-21-0-src-lib, subsystem-3-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_nb_drain_figure_pngs:src/lib/pyodide/runtime.js:249:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_plt_get_fignums:src/lib/pyodide/runtime.js:246:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_pyodide_notebookpackages_js_call_plt_show:src/lib/pyodide/runtime.js:247:0
- Inferred: **Does `subsystem-21-0-src-lib` really depend on `subsystem-5-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-21-0-src-lib, subsystem-5-0-src-lib
  Evidence: edge:symbol_src_lib_pyodide_runtime_js_function_appendpyodidescript:calls:ref_src_lib_notebook_jupyterformat_js_call_document_createelement:src/lib/pyodide/runtime.js:52:0, edge:symbol_src_lib_pyodide_runtime_js_function_drainfigurepngs:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:251:0
- Inferred: **Does `subsystem-23-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-23-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/notebook/parseNotebook.js:22:0
- Inferred: **Does `subsystem-23-0-src-lib` really depend on `subsystem-14-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-23-0-src-lib, subsystem-14-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/notebook/parseNotebook.js:20:0, edge:symbol_src_lib_notebook_parsenotebook_js_function_serializenotebook:calls:ref_src_lib_layout_panellayout_js_call_json_stringify:src/lib/notebook/parseNotebook.js:51:0
- Inferred: **Does `subsystem-23-0-src-lib` really depend on `subsystem-4-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-23-0-src-lib, subsystem-4-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_editor_pythonbuiltins_js_call_print:src/lib/notebook/parseNotebook.js:39:0
- Inferred: **Does `subsystem-23-0-src-lib` really depend on `subsystem-5-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-23-0-src-lib, subsystem-5-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/notebook/parseNotebook.js:21:0, edge:symbol_src_lib_notebook_parsenotebook_js_function_parsenotebook:calls:ref_src_lib_notebook_jupyterformat_js_call_cells_map:src/lib/notebook/parseNotebook.js:26:0
- Inferred: **Does `subsystem-25-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-25-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_markdown_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/markdown.test.js:5:0
- Inferred: **Does `subsystem-26-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-26-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_notebook_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/notebook.test.js:12:0, edge:file_tests_notebook_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/notebook.test.js:5:0
- Inferred: **Does `subsystem-28-0-tests` really depend on `subsystem-2-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-28-0-tests, subsystem-2-0-src-lib
  Evidence: edge:file_tests_kernelsessionkeys_test_js:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_sessionstoragekey:tests/kernelSessionKeys.test.js:6:0, edge:file_tests_kernelsessionkeys_test_js:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_sessionstoragekey:tests/kernelSessionKeys.test.js:8:0
- Inferred: **Does `subsystem-28-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-28-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_kernelsessionkeys_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/kernelSessionKeys.test.js:5:0
- Inferred: **Does `subsystem-29-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-29-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_panellayout_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/panelLayout.test.js:11:0
- Inferred: **Does `subsystem-3-0-src-lib` really depend on `subsystem-4-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-3-0-src-lib, subsystem-4-0-src-lib
  Evidence: edge:file_src_lib_pyodide_notebookpackages_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/notebookPackages.js:29:0, edge:file_src_lib_pyodide_notebookpackages_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/notebookPackages.js:47:0
- Inferred: **Does `subsystem-31-0-src-lib` really depend on `subsystem-0-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-31-0-src-lib, subsystem-0-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_base64_b64decode:src/lib/pyodide/runtime.js:175:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_base64_b64decode:src/lib/pyodide/runtime.js:196:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:278:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_runtime_js_call_cleanupstraymatplotlibwidgets:src/lib/pyodide/runtime.js:287:0
- Inferred: **Does `subsystem-31-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-31-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/pyodide/runtime.js:72:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:281:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:282:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_monacosetup_js_call_trim:src/lib/pyodide/runtime.js:290:0
- Inferred: **Does `subsystem-31-0-src-lib` really depend on `subsystem-13-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-31-0-src-lib, subsystem-13-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pyrightbridge_js_call_async:src/lib/pyodide/runtime.js:23:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pyrightbridge_js_call_async:src/lib/pyodide/runtime.js:68:0
- Inferred: **Does `subsystem-31-0-src-lib` really depend on `subsystem-14-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-31-0-src-lib, subsystem-14-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:341:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:371:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:398:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/pyodide/runtime.js:437:0
- Inferred: **Does `subsystem-31-0-src-lib` really depend on `subsystem-3-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-31-0-src-lib, subsystem-3-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_base64_b64encode:src/lib/pyodide/runtime.js:165:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_decode:src/lib/pyodide/runtime.js:165:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:151:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_pyodide_notebookpackages_js_call_json_dumps:src/lib/pyodide/runtime.js:166:0
- Inferred: **Does `subsystem-31-0-src-lib` really depend on `subsystem-4-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-31-0-src-lib, subsystem-4-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_isinstance:src/lib/pyodide/runtime.js:146:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_len:src/lib/pyodide/runtime.js:116:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_len:src/lib/pyodide/runtime.js:166:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_list:src/lib/pyodide/runtime.js:134:0
- Inferred: **Does `subsystem-31-0-src-lib` really depend on `subsystem-5-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-31-0-src-lib, subsystem-5-0-src-lib
  Evidence: edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:345:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:401:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:402:0, edge:file_src_lib_pyodide_runtime_js:calls:ref_src_lib_notebook_jupyterformat_js_call_array_isarray:src/lib/pyodide/runtime.js:439:0
- Inferred: **Does `subsystem-34-0-tests` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-34-0-tests, subsystem-1-0-src-lib
  Evidence: edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_dottednamebeforecursor:tests/pythonModuleIndex.test.js:10:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_dottednamebeforecursor:tests/pythonModuleIndex.test.js:11:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_importcontext:tests/pythonModuleIndex.test.js:15:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_monacosetup_js_call_importcontext:tests/pythonModuleIndex.test.js:16:0
- Inferred: **Does `subsystem-34-0-tests` really depend on `subsystem-15-0-tests` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-34-0-tests, subsystem-15-0-tests
  Evidence: edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_jupyterformat_test_js_call_assert_deepequal:tests/pythonModuleIndex.test.js:15:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_tests_jupyterformat_test_js_call_assert_deepequal:tests/pythonModuleIndex.test.js:16:0
- Inferred: **Does `subsystem-34-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-34-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/pythonModuleIndex.test.js:14:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/pythonModuleIndex.test.js:22:0, edge:file_tests_pythonmoduleindex_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/pythonModuleIndex.test.js:9:0
- Inferred: **Does `subsystem-35-0-tests` really depend on `subsystem-28-0-tests` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-35-0-tests, subsystem-28-0-tests
  Evidence: edge:file_tests_randomid_test_js:calls:ref_tests_kernelsessionkeys_test_js_call_assert_notequal:tests/randomId.test.js:13:0
- Inferred: **Does `subsystem-35-0-tests` really depend on `subsystem-5-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-35-0-tests, subsystem-5-0-src-lib
  Evidence: edge:file_tests_randomid_test_js:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:tests/randomId.test.js:11:0, edge:file_tests_randomid_test_js:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:tests/randomId.test.js:12:0, edge:file_tests_randomid_test_js:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:tests/randomId.test.js:6:0
- Inferred: **Does `subsystem-35-0-tests` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-35-0-tests, subsystem-6-0-src-lib
  Evidence: edge:file_tests_randomid_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/randomId.test.js:10:0, edge:file_tests_randomid_test_js:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:tests/randomId.test.js:5:0
- Inferred: **Does `subsystem-4-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-4-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:file_src_lib_editor_pythonbuiltins_js:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/editor/pythonBuiltins.js:81:0
- Inferred: **Does `subsystem-5-0-src-lib` really depend on `subsystem-14-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-5-0-src-lib, subsystem-14-0-src-lib
  Evidence: edge:symbol_src_lib_notebook_jupyterformat_js_function_parseimportednotebook:calls:ref_src_lib_layout_panellayout_js_call_json_parse:src/lib/notebook/jupyterFormat.js:100:0
- Inferred: **Does `subsystem-5-0-src-lib` really depend on `subsystem-4-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-5-0-src-lib, subsystem-4-0-src-lib
  Evidence: edge:file_src_lib_notebook_jupyterformat_js:calls:ref_src_lib_editor_pythonbuiltins_js_call_filter:src/lib/notebook/jupyterFormat.js:46:0
- Inferred: **Does `subsystem-6-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-6-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_editor_pythonmoduleindex_js_function_dottednamebeforecursor:calls:ref_src_lib_editor_monacosetup_js_call_lineprefix_endswith:src/lib/editor/pythonModuleIndex.js:123:0, edge:symbol_src_lib_editor_pythonmoduleindex_js_function_dottednamebeforecursor:calls:ref_src_lib_editor_monacosetup_js_call_lineprefix_slice:src/lib/editor/pythonModuleIndex.js:124:0, edge:symbol_src_lib_editor_pythonmoduleindex_js_function_importablemodulesuggestions:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/editor/pythonModuleIndex.js:170:0
- Inferred: **Does `subsystem-6-0-src-lib` really depend on `subsystem-4-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-6-0-src-lib, subsystem-4-0-src-lib
  Evidence: edge:symbol_src_lib_editor_pythonmoduleindex_js_function_importablemodulesuggestions:calls:ref_src_lib_editor_pythonbuiltins_js_call_set:src/lib/editor/pythonModuleIndex.js:171:0
- Inferred: **Does `subsystem-7-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-7-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_writefile:calls:ref_src_lib_editor_monacosetup_js_call_error:src/lib/vfs/vfsTree.js:80:0
- Inferred: **Does `subsystem-7-0-src-lib` really depend on `subsystem-14-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-7-0-src-lib, subsystem-14-0-src-lib
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_ensurestarternotebook:calls:ref_src_lib_layout_panellayout_js_call_json_stringify:src/lib/vfs/vfsTree.js:108:0
- Inferred: **Does `subsystem-7-0-src-lib` really depend on `subsystem-2-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-7-0-src-lib, subsystem-2-0-src-lib
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_createnode:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_date_now:src/lib/vfs/vfsTree.js:41:0, edge:symbol_src_lib_vfs_vfstree_js_function_emptysnapshot:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_date_now:src/lib/vfs/vfsTree.js:12:0, edge:symbol_src_lib_vfs_vfstree_js_function_writefile:calls:ref_src_lib_pyodide_kernelsessionstore_js_call_date_now:src/lib/vfs/vfsTree.js:83:0
- Inferred: **Does `subsystem-7-0-src-lib` really depend on `subsystem-4-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-7-0-src-lib, subsystem-4-0-src-lib
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_ensurestarternotebook:calls:ref_src_lib_editor_pythonbuiltins_js_call_print:src/lib/vfs/vfsTree.js:115:0, edge:symbol_src_lib_vfs_vfstree_js_function_listchildren:calls:ref_src_lib_editor_pythonbuiltins_js_call_filter:src/lib/vfs/vfsTree.js:63:0
- Inferred: **Does `subsystem-7-0-src-lib` really depend on `subsystem-5-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-7-0-src-lib, subsystem-5-0-src-lib
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_createnode:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:src/lib/vfs/vfsTree.js:37:0, edge:symbol_src_lib_vfs_vfstree_js_function_emptysnapshot:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:src/lib/vfs/vfsTree.js:11:0, edge:symbol_src_lib_vfs_vfstree_js_function_ensurestarternotebook:calls:ref_src_lib_notebook_jupyterformat_js_call_randomid:src/lib/vfs/vfsTree.js:113:0
- Inferred: **Does `subsystem-7-0-src-lib` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-7-0-src-lib, subsystem-6-0-src-lib
  Evidence: edge:symbol_src_lib_vfs_vfstree_js_function_ensurestarternotebook:calls:ref_src_lib_editor_pythonmoduleindex_js_call_sort:src/lib/vfs/vfsTree.js:97:0, edge:symbol_src_lib_vfs_vfstree_js_function_listchildren:calls:ref_src_lib_editor_pythonmoduleindex_js_call_sort:src/lib/vfs/vfsTree.js:64:0
- Inferred: **Does `subsystem-8-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-8-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/markdown/renderMarkdown.js:14:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/markdown/renderMarkdown.js:28:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/markdown/renderMarkdown.js:33:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_monacosetup_js_call_split:src/lib/markdown/renderMarkdown.js:26:0
- Inferred: **Does `subsystem-8-0-src-lib` really depend on `subsystem-4-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-8-0-src-lib, subsystem-4-0-src-lib
  Evidence: edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonbuiltins_js_call_filter:src/lib/markdown/renderMarkdown.js:27:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonbuiltins_js_call_filter:src/lib/markdown/renderMarkdown.js:35:0
- Inferred: **Does `subsystem-8-0-src-lib` really depend on `subsystem-6-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-8-0-src-lib, subsystem-6-0-src-lib
  Evidence: edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:src/lib/markdown/renderMarkdown.js:18:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:src/lib/markdown/renderMarkdown.js:24:0, edge:symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown:calls:ref_src_lib_editor_pythonmoduleindex_js_call_test:src/lib/markdown/renderMarkdown.js:27:0
- Inferred: **Does `subsystem-9-0-src-lib` really depend on `subsystem-1-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-9-0-src-lib, subsystem-1-0-src-lib
  Evidence: edge:symbol_src_lib_utils_randomid_js_function_randomid:calls:ref_src_lib_editor_monacosetup_js_call_map:src/lib/utils/randomId.js:19:0
- Inferred: **Does `subsystem-9-0-src-lib` really depend on `subsystem-8-0-src-lib` through `calls`?**
  Confidence: low
  Related subsystems: subsystem-9-0-src-lib, subsystem-8-0-src-lib
  Evidence: edge:symbol_src_lib_utils_randomid_js_function_randomid:calls:ref_src_lib_markdown_rendermarkdown_js_call_join:src/lib/utils/randomId.js:19:0, edge:symbol_src_lib_utils_randomid_js_function_randomid:calls:ref_src_lib_markdown_rendermarkdown_js_call_replace:src/lib/utils/randomId.js:22:0
- Inferred: **How does `dottedNameBeforeCursor()` connect to `linePrefix.endsWith` across boundaries?**
  Confidence: low
  Related subsystems: subsystem-10-0-src-lib, subsystem-12-0-tests
  Evidence: symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures, symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown
- Inferred: **What responsibilities are grouped inside Community 0?**
  Confidence: low
  Related subsystems: subsystem-10-0-src-lib, subsystem-12-0-tests
  Evidence: symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures, symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown
- Inferred: **What responsibilities are grouped inside Community 1?**
  Confidence: low
  Related subsystems: subsystem-10-0-src-lib, subsystem-12-0-tests
  Evidence: symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures, symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown
- Inferred: **What responsibilities are grouped inside Community 2?**
  Confidence: low
  Related subsystems: subsystem-10-0-src-lib, subsystem-12-0-tests
  Evidence: symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures, symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown
- Inferred: **Why is `registerPythonFeatures()` central to the repository?**
  Confidence: low
  Related subsystems: subsystem-10-0-src-lib, subsystem-12-0-tests
  Evidence: symbol_src_lib_editor_monacosetup_js_function_registerpythonfeatures, symbol_src_lib_markdown_rendermarkdown_js_function_rendermarkdown

### Coverage Gaps

- Inferred: **0 document(s) remain unresolved against subsystem evidence.**
  Evidence: artifact:.archify/docs-summary.json
- Inferred: **580 ambiguous edge(s) remain in the graph.**
  Evidence: artifact:.archify/facts.json
