# <%= name %>

This is a plugin description.

## Install

With NPM: (preferred)

```
npm i @pcllab/<%= name %>
```

```js
import <%= kebabToPascal(name) %> from "@pcllab/<%= name %>";
```

With CDN:

```html
<!-- experiment.html -->

<!-- Plugins dependencies -->

<!-- Plugin -->
<script src="https://unpkg.com/@pcllab/<%= name %>"></script>
```

## Use

```js
const trial = {
  type: <%= kebabToPascal(name) %>,
};
timeline.push(trial);
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
