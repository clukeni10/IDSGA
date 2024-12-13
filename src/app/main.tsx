import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "@/components/ui/provider"

const root = ReactDOM.createRoot(document.getElementById('root')!)

if (window.location.hostname === 'localhost') {
	root.render(
		<Provider 
			enableSystem={false}
		>
			<App />
		</Provider>
	)
} else {
	root.render(
		<React.StrictMode>
			<Provider
				enableSystem={false}
			>
				<App />
			</Provider>
		</React.StrictMode>
	)
}