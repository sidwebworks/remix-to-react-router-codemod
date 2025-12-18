export function refactorCodeHelpers(j: JSCodeshift, root: Collection<any>) {
  let dirtyFlag = false;
  let needDataImport = false;

  // ------------------------------------------------------------
  // Decide whether `data` conflicts → use `dataFn`
  // ------------------------------------------------------------
  function getDataImportIdentifier() {
    let conflict = false;

    root.find(j.Identifier, { name: "data" }).forEach((path) => {
      try {
        if (path.scope && path.scope.declares("data")) {
          conflict = true;
        }
      } catch (e) {
        // Ignore invalid scope errors
      }
    });

    return conflict ? "dataFn" : "data";
  }

  const dataIdent = getDataImportIdentifier();

  function unwrapJsonOrDefer(call) {
    const name = call.callee?.name;
    const args = call.arguments || [];

    if (name !== "json" && name !== "defer") return null;

    if (name === "json") {
      if (args.length === 1) {
        return args[0];
      }
      if (args.length === 2) {
        needDataImport = true;
        return j.callExpression(j.identifier(dataIdent), args);
      }
    }

    if (name === "defer") {
      return args[0] || j.identifier("undefined");
    }

    return null;
  }

  root.find(j.CallExpression).forEach((path) => {
    const replacement = unwrapJsonOrDefer(path.node);
    if (replacement) {
      path.replace(replacement);
      dirtyFlag = true;
    }
  });

  if (needDataImport) {
    const importDecls = root.find(j.ImportDeclaration, {
      source: { value: "react-router" },
    });

    let added = false;

    importDecls.forEach((path) => {
      const node = path.node;

      // Skip import type
      if (node.importKind === "type") return;

      const hasData = node.specifiers.some(
        (s) => s.type === "ImportSpecifier" && s.imported.name === "data"
      );

      if (!hasData) {
        node.specifiers.push(
          dataIdent === "data"
            ? j.importSpecifier(j.identifier("data"))
            : j.importSpecifier(j.identifier("data"), j.identifier("dataFn"))
        );
      }

      added = true;
      dirtyFlag = true;
    });

    // No runtime import existed → create one
    if (!added) {
      root
        .get()
        .node.program.body.unshift(
          j.importDeclaration(
            [
              dataIdent === "data"
                ? j.importSpecifier(j.identifier("data"))
                : j.importSpecifier(
                    j.identifier("data"),
                    j.identifier("dataFn")
                  ),
            ],
            j.literal("react-router")
          )
        );
      dirtyFlag = true;
    }
  }

  return dirtyFlag;
}
