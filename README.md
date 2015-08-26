# Maestrano Widgets

This is a web app designed to show sample implementation of Maestrano Widgets using their APIs. There are two types of widgets:

1. "Employees location" widget
2. "Sales flow" widget

When you first time open the app, you will see two placeholders for widgets. You can add widgets either by clicking on any of the widgets, or by clicking 'Add widget' button. In both cases, you will be required to select widget type from provided options.


## Usage
In order to run the app in your own workspace, please get the app from GitHub:
```
git clone git@github.com:atabekm/impac-widgets.git
```
and run following commands:
```
cd impac-widgets
rails server
```

## Demo
You can look and test demo version of the app at https://impac-widgets.herokuapp.com/

## Tools used
`Ruby on Rails` was used as backend, while `AngularJS` as frontend.
Apart from above frameworks, following libraries were used for visualization effects:
- `Google Maps JavaScript API` for geocoding and building map related diagrams
- `Google Visualization API` for drawing different kind of charts and diagrams

## Testing
Unfortunately, due to restricted time limit, it was not possible to implement any kind of testing.
