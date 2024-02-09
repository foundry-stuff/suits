class Suits {

	static toggle(token, config) {

        // Toggle isEuipped and save it in flags.
        const isEquipped = !token.document.getFlag("suits", "isEquipped");
		token.document.setFlag("suits", "isEquipped", isEquipped);

		// Get token and avatar path.
		const tokenPath = (isEquipped) ? config["on"]["token"] : config["off"]["token"];
		const avatarPath = (isEquipped) ? config["on"]["avatar"] : config["off"]["avatar"];

		// Update token and avatar.
		token.document.update({"texture.src": tokenPath});
        game.modules.get("vtta-tokenizer").api.autoToken(token.actor, {tokenFilename: tokenPath, avatarFilename: avatarPath});

	}


	static addControlButton(html) {

		// Do not bother to add button when multiple tokens are selected.
		if (canvas.tokens.controlled.length != 1)
			return;

		let token = canvas.tokens.controlled[0];
		const JsonConfig = JSON.parse(this.buttonJsonConfigSetting());

		// Get config for token/char.
		let config = false;
		for (var char in JsonConfig) {
			if (token.name.includes(char))
				config = JsonConfig[char];
		}

		// Leave and don't add button when there is no config.
		if (!config)
			return;

		// Setup button.
		let button = $("<div class='control-icon'><i></i></div>");
 		button.find("i").addClass(this.buttonIconSetting());

 		// Set button to active when state is "on".
 		if (token.document.getFlag("suits", "isEquipped"))
			button.addClass("active");

		// Add button to the left or right side.
    	html.find(".col."+Suits.buttonSideSetting()).prepend(button);

    	// Register click.
		button.click(async (event) => {
			event.preventDefault();
			event.stopPropagation();
			Suits.toggle(token, config);
		});
	}


  	// Register keyboard shortcut.
	static registerKeyboardShortcut() {
		game.keybindings.register("suits", "toggle", {
			name: game.i18n.localize("SUITS.KEYBOARDSHORTCUT.NAME"),
			onDown: () => { this.toggle(); },
			editable: [{ key: "KeyR" }],
			precedence: -1
		});

	}


  	// Register button side setting.
	static registerButtonSideSetting() {
		game.settings.register("suits", "button-side", {
			name: game.i18n.localize("SUITS.BUTTON.LOCATION.NAME"),
			hint: game.i18n.localize("SUITS.BUTTON.LOCATION.HINT"),
			scope: "client",
			config: true,
			type: String,
			choices: {
				"left": game.i18n.localize("SUITS.BUTTON.LOCATION.LEFT"),
				"right": game.i18n.localize("SUITS.BUTTON.LOCATION.RIGHT") 
			},
			default: "left"
		});
	}


  	// Get button side setting.
	static buttonSideSetting() {
		return game.settings.get("suits", "button-side");
	}


  	// Register button side setting.
	static registerButtonIconSetting() {
		game.settings.register("suits", "button-icon", {
			name: game.i18n.localize("SUITS.BUTTON.ICON.NAME"),
			hint: game.i18n.localize("SUITS.BUTTON.ICON.HINT"),
			scope: "world",
			config: true,
			type: String,
			default: "fa-solid fa-user-astronaut"
		});
	}


  	// Get button side setting.
	static buttonIconSetting() {
		return game.settings.get("suits", "button-icon");
	}


  	// Register button side setting.
	static registerJsonConfigSetting() {
		game.settings.register("suits", "json-config", {
			name: game.i18n.localize("SUITS.JSON.NAME"),
			hint: game.i18n.localize("SUITS.JSON.HINT"),
			scope: "world",
			config: true,
			type: String,
			default: '{"char1":{"on":{"token":"/path/to","avatar":"/path/to"},"off":{"token":"/path/to","avatar":"/path/to"}},"char2":{"on":{"token":"/path/to","avatar":"/path/to"},"off":{"token":"/path/to","avatar":"/path/to"}}}'
		});
	}


  	// Get button side setting.
	static buttonJsonConfigSetting() {
		return game.settings.get("suits", "json-config");
	}

}


Hooks.on("ready", () => {
	Hooks.on("renderTokenHUD", (app, html, drawData) => {
		Suits.addControlButton(html);
	});

});


Hooks.on("init", function () {
	Suits.registerButtonSideSetting();
	Suits.registerButtonIconSetting();
	Suits.registerKeyboardShortcut();
	Suits.registerJsonConfigSetting();
});
