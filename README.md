# Ionic Location based Augmented Reality
The repository contains a Ionic 4 example app with an implementation of a simple location based augmented reality. Using gps data, a Rest service (a GET method call) and device sensors (accelerometer, gyroscope and magnetometer) datas, some Points Of Interest (POIs) are drawn on a camera preview background layer.
Sensors datas are combined with a porting of a Complementary Filter paradigm called Sensors Fusion.

## Algorithm explaination
In this section there is an explaination of the AR algorithm:

1. Camera preview activation as view background, and camera field of view angle (FOV) retrieve.
2. Activation of gps and fusion sensors (accelerometer, gyroscope, magnetomer) services.
3. At the arrive of gps data, verify if it is far from the previous one (if there is; if not use this position) for at least a gps min distance in meters. If true, execute a Rest call to retrieve POIs (Point of Interest); obviously each POI contains its geographic position informations (latitude and longitude). 
4. For each POI included in a maximum radius in meters from the user, collect all the informations retrieved from the Rest service and calculate informations of distance and bearing by user geolocation; these informations are inserted in a pin structure, populating an array of pins.
5. At the arrive of orientation sensor fusion data, for each pin included in the camera Field Of View (FOV) (calculated by previous bearing informations retrieved), some on screen displacement infos are calculated and inserted in a spot structure populating a spot array.
6. Finally, each spot of the spot array is drawn on the view as camera background overlay.

## Source code structure
In this section explains how the source code is organized, and the main package used to manage the app logics.

### Redux
The app integrates a state - action management using a Redux store module (for more infos visit https://redux.js.org).

Here the packages included:
- [Redux logger](https://www.npmjs.com/package/redux-logger): it logs every action and store state change to facilitate development
- [Redux persist](https://www.npmjs.com/package/redux-persist): it let to save some store sub-state datas. With a blacklist system let the developer to choose what states to save in the internal storage. In the app it isn't used directly, but it's used as a dependency of the next redux-offline package
- [Redux offline](https://www.npmjs.com/package/@redux-offline/redux-offline): it let an offline management of the app, waiting device connection when a service call is done, retrying on call error, etc.
- [Redux saga](https://www.npmjs.com/package/redux-saga): it's an extension of redux actions triggering; for example it let to launch an action at the arrive of another, to sync some parallel triggered actions, etc.

All redux store files are contained in the src/store folder; store.module.ts file contains all its logics and settings.
It also define some redux middlewares explained in the next section.

### Rest services
The app integrates only the POIs retrieve Rest call.

This service takes as input values the user current latitude and longitude, and a maximum radius in which POIs are searched. 
Since the app is shared as an example app, it doesn't call a real back-end service, but the call is mocked with an internal poi-list.json file contained in src/assets/mock-data.

**To test the app consistently using this internal json file, _please modify the example POIs gps positions (latitude and longitude) with some points near to you._**

The call is triggered by redux-offline package, and executed using HTTP ionic-native device modules when a real back-end service is called, or using Angular HttpModule on a mock call.

##### Offilne middleware
To improve redux-offline connection waiting and to prevent an infinite connection waiting, an 'offlineTimeout' middleware is used. At the launch of a call action, a timeout is set. When the timeout occurs, if no data is retrieved, dismiss redux-offline action.

##### Data normalizer middleware
Tipically when some data is retrieved by a back-end service, this data need some manipulation before being shown on a view/page interface. The code proposes a decoupling system by another 'dataNormalizer' middleware. When some data is retrieved, it is given as input to a converter function (src/util/converter.ts source file). The converter manipulates service data and returns optimized data to show.
Back-end data is typed using special data called DTO (Data Transfer Object) contained in src/entities/dto folder; data types to show on page are stored in src/entities/form folder instead.

### Environments
Ionic 4 applications natively support 2 build environments: development and production. To build and app in production mode add the --prod flag in the build command line.
In the src/environments folder there are two files environment.ts and environment.prod.ts used in order in dev and prod modes, and they contain same flags setted differently based on build mode. 
As previously described, a 'mock' flag is setted to use internal mocked Rest calls (setted to true in dev mode by default).
To test the app with a back-end, please deploy somewhere a back-end service that return a similar poi-list.json data, and adjust environment baseUrl and apiVersion flags.

### Constants
A source file containing the app constants is located in src/app/util folder.

The file contains Rest services endpoints, and some other values used in the AR module:
- sensors relevation frequency
- default camera fov
- ar radius
- events identifiers

### Translation and Globalization
The app includes a translation module using some json files contained in src/assets/i18n folder.
Actually it includes an english (en.json) and an italian (it.json) translation files.
Globalization ionic-native wrapper let the app to switch from a language to another accordingly to the in use language on device. English language is used as default, and italian one used only when available and setted as main language.
Translation settings are stored in src/app/i18n.constants.ts and used in initialization phase in src/app/app.component.ts; the translation module is loaded per page lazily instead.

### AR logics
Augmented Reality logics consist of many actions executed only when a previous one ends. Once again redux comes in our help with redux-saga package, let it to manage the greater part of the algorithm. These sagas actions are implemented in src/store/sagas.ts file.
All calculations are contained in src/util/utils.ts file in a AugmentedRealityUtils class.

### Css styles
The app includes a src/styles folder containing the main style used in the app:
- _layout.scss file contains main layout rules of common components used in the whole app
- _override-ionic.scss file contains some rules to reset some default rules of ionic components
- _responsive.scss and _mixins.scss files declare some useful styles to manage the app responsiveness and some style common use cases
- _variables.scss, _colors.scss and _fonts.scss declare some general variables and variables related to colors and fonts commonly used in whole app.

All other page dependent styles are declared per page in their own scss files.
