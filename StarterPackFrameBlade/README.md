# Azure Portal FrameBlade
FrameBlade.ts demonstrates how to integrate StarterPackSample output (e.g. index.html and associated JavaScript files) with your extension.  To utilize this blade:

1. Copy FrameBlade.ts to the host extension.
2. Import a reference to the host extension's Data Context type.
3. Replace 'ExtensionDataContextType' (line 8) with the name of the imported data context type
4. Populate the relative path to index.html (line 15) as the paramter to ...getVersionlessContentUri("");

The FrameBlade will subsequently render index.html as an iframe, supplying necessary configuration and environment properties. 



