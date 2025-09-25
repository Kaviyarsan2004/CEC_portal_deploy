const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Determine Python command based on OS and venv availability
let pythonCmd;
if (process.platform === "win32") {
    const venvPython = path.join(__dirname, "../venv/Scripts/python.exe");
    pythonCmd = fs.existsSync(venvPython) ? venvPython : "py -3"; // venv or global
} else {
    pythonCmd = "python3"; // macOS/Linux
}

const app = process.argv[2];
const port = process.argv[3];

execSync(`cd ../apps/${app} && ${pythonCmd} -m streamlit run app.py --server.port=${port} --server.address=0.0.0.0 --server.headless=true`, { stdio: "inherit" });

