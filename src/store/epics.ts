import { combineEpics } from 'redux-observable-es6-compat';

var staticEpics = [
];
var dynamicEpics = {};

export function addEpic(id: string, epic: any)
{
	if (!dynamicEpics[id])
		dynamicEpics[id] = epic;

	return rootEpic();
}

export function removeEpic(id: string)
{
	if (dynamicEpics[id])
		delete dynamicEpics[id];

	return rootEpic();
}

export default function rootEpic()
{
	let dynamicEpicsArray = Object.values(dynamicEpics);

    return combineEpics(
		...staticEpics,
		...dynamicEpicsArray
	);
}