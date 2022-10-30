# free-recall-plugin

This is a plugin description.

## Install

With NPM: (Preferred)

```
npm i @pcllab/free-recall-plugin
```

```js
import FreeRecallPlugin from "@pcllab/free-recall-plugin";
```

With CDN:

```html
<!-- experiment.html -->
<head>
  <!-- rest of head -->

  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
    crossorigin="anonymous"
  />
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
  <script src="https://unpkg.com/@pcllab/free-recall-plugin"></script>
</body>
```

## Use

```js
const trial = {
  type: FreeRecallPlugin,
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
