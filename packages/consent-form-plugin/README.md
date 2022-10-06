# consent-form-plugin

This plugin will display an arbitrary HTML page and automatically add a required checkbox and continue button at the bottom.

## Install

```
npm i @pcllab/consent-form-plugin
```

## Use

```js
import ConsentFormPlugin from '@pcllab/consent-form-plugin';

// ...snip

const trial = {
  type: ConsentFormPlugin,
  url: 'anyurl.html',
};
timeline.push();

// ...snip
```

## Parameters

| Parameter | Type   | Description                                                                                                                                                        | Examples                                                                                                                       |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| url       | string | Url of consent form. This can be relative or absolute. Uses `fetch()` internally. This defaults to an example url, but should be specified for actual experiments. | (default)<br>`"https://www.jarvis.psych.purdue.edu/weblab/consent.html"`<br><br>`"consent.html"`<br>`"../different-form.html"` |

## Data Generated

In addition to the default data collected by all plugins, this plugin collects the following data for each trial.

| Name | Type   | Value                                                                                                                     |
| ---- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| rt   | number | Response time in milliseconds. This is measured from when the form appears until the subject presses the continue button. |
