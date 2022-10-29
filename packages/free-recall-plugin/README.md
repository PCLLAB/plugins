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

<!-- Plugins dependencies -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Plugin -->
<script src="https://unpkg.com/@pcllab/free-recall-plugin"></script>
```

## Use

```js
const trial = {
  type: FreeRecallPlugin,
};
timeline.push();
```

## Parameters

| Parameter | Type | Description | Examples                           |
| --------- | ---- | ----------- | ---------------------------------- |
|           |      |             | (default)<br>DEFAULT<br><br>others |

## Data Generated

In addition to the default data collected by all plugins, this plugin collects the following data for each trial.

| Name | Type | Value |
| ---- | ---- | ----- |
|      |      |       |
