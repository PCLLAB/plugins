# audio-response-plugin

This is an audio response plugin that can accept button and keyboard responses.

It is a combination of jsPsych's [audio-keyboard-response](https://www.jspsych.org/7.3/plugins/audio-keyboard-response/) and [audio-button-response](https://www.jspsych.org/7.3/plugins/audio-button-response/) plugins.

## Install

With NPM:

```
npm i @pcllab/plugin-audio-response
```

```js
import pcllabAudioResponse from "@pcllab/plugin-audio-response";
```

With CDN:

Other dependencies (react, react-dom, tailwind) need to loaded separately.

```html
<script src="https://unpkg.com/@pcllab/plugin-audio-response"></script>
```

## Use

```js
const trial = {
  type: pcllabAudioResponse,
  stimulus: "audio.mp3"
  keyboard: {
    choices: ["y", "n"]
  }
  button: {
    choices: ["Yes", "No"]
  }
};
```

## Parameters

| Parameter                | Type                                | Description                                                                                                                          | Examples                                                                                                                                                                           |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| keyboard                 | object                              | Allow keyboard responses                                                                                                             | (default)<br>`undefined`<br><br>`{}`                                                                                                                                               |
| keyboard.choices         | string[] \| "ALL_KEYS" \| "NO_KEYS" | Restrict keyboard responses                                                                                                          | (default)<br>`ALL_KEYS`<br><br>`["y", "n"]`                                                                                                                                        |
| button                   | object                              | Allow button responses                                                                                                               | (default)<br>`undefined`<br><br>`{}`                                                                                                                                               |
| button.choices           | string[]                            | Button text                                                                                                                          | (default)<br>`undefined`<br><br>`["y", "n"]`                                                                                                                                       |
| button.html              | string \| string[]                  | One HTML string for all buttons or list of strings to use for each choice, where `%choice%` is replaced by the corresponding choice. | (default)<br>`"<button class="jspsych-btn">%choice%</button>"`<br><br>`["<button class="custom-class">1. %choice%</button>", "<button class="custom-class">2. %choice%</button>"]` |
| button.margin_vertical   | string                              | Vertical padding style value                                                                                                         | (default)<br>`"0px"`<br><br>`"12px"`                                                                                                                                               |
| button.margin_horizontal | string                              | Horizontal padding style value                                                                                                       | (default)<br>`"8px"`<br><br>`"0px"`                                                                                                                                                |
| prompt                   | html string                         | Arbitrary HTML to show above the input                                                                                               | (default)<br>`""`<br><br>`<h1>Here is a prompt </h1>`                                                                                                                              |

## Data Generated

In addition to the default data collected by all plugins, this plugin collects the following data.

| Name     | Type   | Value                                          |
| -------- | ------ | ---------------------------------------------- |
| response | string | The button choice or key pressed               |
| rt       | number | Time in ms between audio starting and response |
