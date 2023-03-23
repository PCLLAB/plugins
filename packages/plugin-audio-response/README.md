# audio-response-plugin

This is a plugin description.

## Install

With NPM: (Preferred)

```
npm i @pcllab/plugin-audio-response
```

```js
import audioResponse from "@pcllab/plugin-audio-response";
```

With CDN:

```html
<!-- experiment.html -->
<head>
  <!-- rest of head -->

  <script src="https://cdn.tailwindcss.com"></script>
  <style type="text/tailwindcss">
    @layer base {
      input,
      textarea {
        @apply border rounded px-1;
      }
    }
  </style>
</head>

<body>
  <!-- rest of body -->

  <!-- Plugins dependencies -->
  <script
    crossorigin
    src="https://unpkg.com/react@18/umd/react.production.min.js"
  ></script>
  <script
    crossorigin
    src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"
  ></script>

  <!-- Plugin -->
  <script src="https://unpkg.com/@pcllab/plugin-audio-response"></script>
</body>
```

## Use

```js
const trial = {
  type: audioResponse,
};
timeline.push();
```

## Parameters

| Parameter    | Type        | Description                            | Examples                                                  |
| ------------ | ----------- | -------------------------------------- | --------------------------------------------------------- |
| allow_delete | boolean     | Allow recalled words to be deleted     | (default)<br>`false`<br><br>`true`                        |
| button_label | string      | Label to show on continue button       | (default)<br>`"Continue"`<br><br>`"Next"`<br>`"继续"`     |
| stimulus     | html string | Arbitrary HTML to show above the input | (default)<br>""<br><br>`<h1>Type what you remember.</h1>` |

## Data Generated

**This plugin will output data multiple times.**

In addition to the default data collected by all plugins, this plugin collects the following data for each _recalled word_.

| Name              | Type   | Value                                                                                                                                                    |
| ----------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| response          | string | A word added to the recall list                                                                                                                          |
| rt_first_keypress | number | Time in ms between first keypress of current word and the last keypress of the previous word. The trial start time is used if there is no previous word. |
| rt_last_keypress  | number | Time in ms between last keypress of current word and the last keypress of the previous word. The trial start time is used if there is no previous word.  |