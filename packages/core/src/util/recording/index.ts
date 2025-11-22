// This file serves as a barrel, re-exporting all modules from the 'recording' directory.
// This pattern helps in organizing and simplifying imports in larger projects,
// allowing other modules to import from a single entry point.

export * from './addEvent';
export * from './domChanges';
export * from './addBodyEvents';
export * from './saveClickData';
export * from './addClickToNode';
export * from '../node/isClickableNode'; // Re-exporting from a parent directory, indicating shared utility.
export * from './recordUserClick';
export * from './fetchHtmlFormElements';
export * from './mapClickedElementToHtmlFormElement';
