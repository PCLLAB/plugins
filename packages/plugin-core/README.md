# plugin-core

This plugin handles most of the core procedures of an experiment. The tasks that tasks that it can do include (but are not limited to) showing instructions, short-answer tasks, cued-recall tasks, ratings tasks, etc.

**Table of contents**

- [Core](#core)
  - [Parameters](#parameters)
    - [Stimuli Parameters](#stimuli-parameters)
    - [Display Parameters](#display-parameters)
    - [Timing Parameters](#timing-parameters)
    - [Miscellaneous Parameters](#miscellaneous-parameters)
    - [Stimulus Hyperparameters](#stimulus-hyperparameters)
  - [Additional Features](#additional-features)
    - [Hook Functions](#hook-functions)
    - [A note on done_callback](#a-note-on-donecallback)
    - [Feedback](#feedback)
    - [Adaptive Spacing](#adaptive-spacing)
    - [Free Recall of Text](#free-recall-of-text)
    - [Free Recall of a Word List](#free-recall-of-a-word-list)

## Parameters

### Stimuli Parameters

| Parameter     | Type   | Default Value | Description                                      |
| ------------- | ------ | ------------- | ------------------------------------------------ |
| stimuli       | array  | [ ]           | List of stimulus objects to present sequentially |
| stimulus_file | string | null          | url to a file containing stimuli                 |

### Display Parameters

| Parameter                              | Type     | Default Value | Description                                                                                          |
| -------------------------------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------- |
| title                                  | string   | null          | Title shown at the top of the screen                                                                 |
| show_button                            | boolean  | false         | Shows the _next_ button                                                                              |
| button_text                            | string   | 'Next'        | Text of the _next_ button                                                                            |
| show_i_dont_know                       | boolean  | false         | Shows an _I don't know_ button                                                                       |
| response_count (rename: response_box)  | number   | 1 (redo: 0)   | The number of response boxes presented (whether a response box is shown)                             |
| input_size (rename: response_box_size) | string   | 'medium'      | Size of the input box. ('small', 'medium', 'large' or 'xlarge')                                      |
| response_box_align                     | string   | 'center'      | Alignment of text in the response boxes. ('left', 'right' or 'center')                               |
| forced_response                        | boolean  | false         | Toggles whether a response must be provided before the _next_ button can be clicked                  |
| show_progress                          | boolean  | false         | Toggles the progress bar                                                                             |
| progress_total_time                    | boolean  | false         | If true, the progress bar will span the duration of all the stimuli, including isi for each          |
| cue_align                              | string   | 'vertical'    | Alignment of items in the cue_list that are presented. ('vertical' or 'horizontal')                  |
| word_bank_align                        | string   | 'vertical'    | Alignment of the word bank, either below the cue or to the right of it. ('vertical' or 'horizontal') |
| feedback                               | boolean  | false         | Toggles displaying feedback after each stimulus screen                                               |
| feedback_html                          | function | null          | Hook function to return arbitrary html as feedback after a stimulus screen. [See more](#feedback)    |

### Timing Parameters

| Parameter    | Type   | Default Value | Description                                          |
| ------------ | ------ | ------------- | ---------------------------------------------------- |
| isi          | number | 500           | isi duration                                         |
| minimum_time | number | 0             | Minimum time before the next button is displayed     |
| maximum_time | number | 3000          | Maximum time before the trial automatically procedes |

### Miscellaneous Parameters

| Parameter        | Type    | Default Value | Description                                                 |
| ---------------- | ------- | ------------- | ----------------------------------------------------------- |
| randomize        | boolean | false         | Toggles the randomization of the order of presented stimuli |
| scoring_strategy | string  | null          | Strategy used to score responses. ('exact' or 'dice')       |

### Stimulus Hyperparameters

In addition to the parameters passed to jsPsych, the plugin has an additional layer of parameters specific to each stimulus in the stimuli object.

A quick example:

If we wanted one stimulus of our procedure to show 2 response boxes and display panels, we can do that by including certiain hyperparameters in the stimulus object.

```javascript
[
    ...
    \\ Regular boring stimuli
    ...

    {
        cue: 'The ______ is ____',
        cue_panel_title: 'Fancy cue panel header',
        target_list: ['Earth', 'flat'],
        response_panel_title: 'Enter your honest opinion',
        response_count: 2
    }
]
```

The core plugin supports many ways for a subject to generate a response. The type of display is controlled by the _response_type_ hyperparameter.

| Name        | Description                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------- |
| input       | This is the default value if response_type is left blank. The user is presented with input fields |
| radio       | The user is presented with options, out of which only one can be selected                         |
| button      | The user is presented with labeled button(s)                                                      |
| study_items | The user is presented with the provided cue and target to study                                   |
| slider\*    | The user is presented with a slider                                                               |
| checkbox\*  | The user is presented with checkbox(es)                                                           |

---

\* Under construction

## Additional Features

### Hook Functions

The core plugin exposes an interface to hook into certain events during the trial. The `on_stimulus_start` and `on_stimulus_end` functions pass in a `pluginAPI` object as a parameter to the provided callbacks. Read more about the `pluginAPI` object in the [Adaptive Spacing](#adaptive-spacing) section.

| Parameter         | Type     | Default Value | Description                                                                                                       |
| ----------------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------- |
| done_callback     | function | null          | Callback function providing access to data produced by the procedure                                              |
| on_stimulus_start | function | null          | Callback function that is fired right before a stimulus screen is presented. Passes in `pluginAPI` as a parameter |
| on_stimulus_end   | function | null          | Callback function that is fired right after a stimulus screen ends. Passes in `pluginAPI` as a parameter          |

### A note on done_callback

The _done_callback_ callback provides a way to dynamically retrieve the data produced by the procedure. The callback passes back a list containing datablocks pertaining to each trial of the procedure.

Keep in mind that the data produced may or may not contain all the parameters mentioned above, depending on how the plugin is configured.

A quick example:

```javascript
function list_data(data) {
    data.forEach((datablock, index) => {
        console.log(`Data for stimulus ${index + 1}: `, datablock)
    })
}

...

jsPsych.init({
    ...
    timeline: [{
        type: pcllabCore,
        ...
        done_callback: list_data
    }]
})

/*
Data for stimulus 1: {
    cue: 'Example cue'
    cue_list: ['Cue 1', 'Cue 2', ...]
    rt: 1673
    rt_first_keypress: 534
    ...
}
```

### Feedback

The callback `feedback_html` provides a way to show feedback after a screen given the `feedback` flag is set to true. The core plugin passes in a list of all the data recorded till that point. The plugin expects the provided callback to return some html that will be rendered on the screen.

```javascript
    const trial = {
        type: pcllabCore,
        stimuli: [
            {
                cue: 'Should pineapples be on pizza',
                target: 'yes',
            },
        ],
        ...,
        feedback: true,
        feedback_html: (data) => {
            const lastData = data.slice(-1)[0]
            if (lastData.response === lastData.target) {
                return `<h4 class="text-center">You answered correctly</h4>`
            } else {
                return `<h4 class="text-center">You answered incorrectly</h4>`
            }
        }
    }
```

### Adaptive Spacing

The `pluginAPI` object passed into certain hook functions as a parameter provides a set of functions that can be used to get information about the trial and modify the timeline.

**pluginAPI.getAllData**
<br/>
`Datablock[] getAllData(void)`
<br/>
Returns a list of all datablocks recorded till the present time.

**pluginAPI.getLastData**
<br/>
`Datablock getLastData(void)`
<br/>
Returns the most recent datablock recorded.

**pluginAPI.getCompletedStimuli**
<br/>
`Stimulus[] getCompletedStimuli(void)`
<br/>
Returns a list of all the stimuli blocks that were run till the present time.

**pluginAPI.getRemainingStimuli**
<br/>
`Stimulus[] getRemainingStimuli(void)`
<br/>
Returns a list of all the stimuli blocks in order that are still scheduled for execution.

**pluginAPI.setTimeline**
<br/>
`void setTimeline(Stimulus[])`
<br/>
Sets the remaining timeline items to the list of stimuli.

## Data Generated

This plugin collects the following data for each stimulus:

| Name              | Type                                       | Value                                                                                                                                     |
| ----------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| cue               | string                                     | Cue presented to the subject                                                                                                              |
| cue_list          | array                                      | List of cues presented to the subject                                                                                                     |
| target            | string                                     | Target to score the response against                                                                                                      |
| target_list       | List of targets to score responses against |
| response          | string or list                             | Responses generated by the subject. The output will be a string if there is just one response, but will be an array if there are multiple |
| response_index    | number                                     | Index of the stimulus/response in the procedure                                                                                           |
| rt                | number                                     | Response time                                                                                                                             |
| rt_first_keypress | number                                     | Time of the first keypress                                                                                                                |
| rt_last_keypress  | number                                     | Time of the last keypress                                                                                                                 |
| type              | string                                     | Type of the cue (specified in the stimuli object)                                                                                         |
| total_score       | number                                     | Score of the response(s) in the current stimulus                                                                                          |
| cumulative_score  | number                                     | Score of the responses till (anc including) the current stimulus                                                                          |

## Examples

### Instructions (Study Text)

Present instructions, or study a text, with a title and text

In this example, need to note how this.instructions is set up (it's calling in instructions.json)

```javascript
const lookUp = {
  type: pcllabCore,
  stimuli: [this.instructions["look-up"]],
  response_count: 0,
  show_button: true,
  button_text: "Continue",
  data: {
    phase: "instructions",
  },
};
```

### Study Words (Study Items)

Show how words or word pairs would be in a JSON, then how Core would read in that JSON word list. (Words, word pairs, key terms)

File would be word-list.json or word-pairs.json

Also explain how to show individual stimuli

### Study Word Pairs

```javascript
const studyItemsTrial = {
  type: pcllabCore,
  stimuli: [
    { response_type: "study_items", cue: "Kirvis", target: "Axe" },
    { response_type: "study_items", cue: "Marco", target: "Polo" },
  ],
  maximum_time: 5000,
  show_progress: true,
  response_count: 0,
};
```

### Cued Recall

Explain how cued recall is done. Word as cue, or a question as cue. Box size differs.

```javascript
const cuedRecallTrial = {
  type: pcllabCore,
  stimuli: [
    { response_type: "study_items", cue: "A", target: "Apple" },
    {
      response_type: "study_items",
      cue: "What is the answer to life the universe and everything?",
      target: "42",
    },
    { cue: "A", target: "Apple", response_count: 1 },
    {
      cue: "What is the answer to life the universe and everything?",
      target: "42",
      response_count: 1,
    },
  ],
  input_size: "small",
  response_count: 0,
  show_button: true,
};
```

### Free Recall of Text

The title of a text is shown, with x-large response box. (Prompts can also be shown?)

### Free Recall of a Word List

We have a specific way we do this.
