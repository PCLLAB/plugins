# consent-form-plugin

## Parameters

| Parameter | Type   | Description                                                                                                                                                        | Examples                                                                                                                    |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| url       | string | Url of consent form. This can be relative or absolute. Uses `fetch()` internally. This defaults to an example url, but should be specified for actual experiments. | (default) `"https://www.jarvis.psych.purdue.edu/weblab/consent.html"`<br><br>`"consent.html"`<br>`"../different-form.html"` |

## Data Generated

In addition to the default data collected by all plugins, this plugin collects the following data for each trial.

| Name | Type   | Value                                                                                                                     |
| ---- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| rt   | number | Response time in milliseconds. This is measured from when the form appears until the subject presses the continue button. |

## Building

Run `nx build consent-form-plugin` to build the library.

## Running unit tests

Run `nx test consent-form-plugin` to execute the unit tests via [Jest](https://jestjs.io).
