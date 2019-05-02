# Ionic Location based Augmented Reality
The repository contains a Ionic 4 example app with an implementation of a simple location based augmented reality. Using gps data, a Rest service (a GET method call) and device sensors (accelerometer, gyroscope and magnetometer) datas, some Points Of Interest (POIs) are drawn on a camera preview background layer. Sensors datas are combined with a porting of a Complementary Filter paradigm called Sensors Fusion.

## Algorithm explaination
In this section there is an explaination of the AR algorithm:

1) Camera preview activation as view background, and camera field of view angle (FOV) retrieve.
2) At the arrive of gps data, verify if it is far from the previous one (if there is; if not use this position) for at least a gps min distance in meters. If true, execute a Rest call to retrieve POIs (Point of Interest); obviously each POI contains its geographic position informations (latitude and longitude). 
3) For each POI included in a maximum radius in meters from the user, collect all the informations retrieved from the Rest service and calculate informations of distance and bearing by user geolocation; these informations are inserted in a pin structure, populating an array of pins.
4) At the arrive of orientation sensor fusion data, for each pin included in the camera Field Of View (FOV) (calculated by previous bearing informations retrieved), some on screen displacement infos are calculated and inserted in a spot structure populating a spot array.
5) Finally, each spot of the spot array is drawn on the view as camera background overlay.

## Source code structure
In this section will be explained how the source code is organized, and the main package used to manage the logics of the app.

### Redux
The app integrates a state - action management using a Redux store module (for more infos go to [https://redux.js.org](https://redux.js.org)).

Here the packages included:
- Redux logger: it logs every action and store state change to facilitate development (https://www.npmjs.com/package/redux-logger)
- Redux persist: it let to save some store sub-state datas. With a blacklist system let the user to choose what states to save in the internal storage. In the app it isn't directly, but it's used as a dependency of the next redux-offline package (https://www.npmjs.com/package/redux-persist)
- Redux offline: it let an offline management of the app, waiting device connection when a service call is done, retrying on call error, etc. (https://www.npmjs.com/package/@redux-offline/redux-offline)
- Redux saga: it's an extension of redux actions triggering; for example it let to launch an action at the arrive of another, to sync some parallel triggered actions, etc. (https://www.npmjs.com/package/redux-saga)



