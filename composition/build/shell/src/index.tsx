import ReactDOM from "react-dom";
import { StrictMode } from "react";
import { SharedProvider } from "@composition-build/shared-context";
import { App } from "./App";

ReactDOM.render(
	<StrictMode>
		<SharedProvider>
			<App />
		</SharedProvider>
	</StrictMode>,
	document.getElementById("root")
);
