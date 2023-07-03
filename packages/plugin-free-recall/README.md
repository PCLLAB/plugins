# free-recall-plugin

This plugin allows free recall. A text input allows any number of non-repeated words to be added to a list.

## Install

With NPM:

```
npm i @pcllab/plugin-free-recall
```

```js
import freeRecall from "@pcllab/plugin-free-recall";
```

With CDN:

```html
<script src="https://unpkg.com/@pcllab/plugin-free-recall"></script>
```

## Use

```js
const trial = {
  type: freeRecall,
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

| Name     | Type   | Value                                                   |
| -------- | ------ | ------------------------------------------------------- |
| response | string | A word added to the recall list                         |
| rt       | number | Time in ms between start of trial and submitting a word |
