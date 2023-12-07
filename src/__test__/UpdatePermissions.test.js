import { render, screen } from '@testing-library/react';
import RecordSequenceDetails from './RecordSequenceDetails';

describe('RecordSequenceDetails', () => {
    test('addSkipClass should return correct class', () => {
        const item = { status: 'completed', objectdata: { meta: { skipDuringPlay: true } } };
        expect(RecordSequenceDetails.addSkipClass(item)).toBe('skipped uda_exclude');

        const item2 = { status: 'in progress', objectdata: { meta: { skipDuringPlay: false } } };
        expect(RecordSequenceDetails.addSkipClass(item2)).toBe('in progress uda_exclude');
    });

    test('displayKeyValue should render correct text', () => {
        render(RecordSequenceDetails.displayKeyValue('key', 'value'));
        expect(screen.getByText('key value')).toBeInTheDocument();
    });

    test('copy should set copied state to true', () => {
        const elMock = document.createElement('input');
        const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
        const execCommandSpy = jest.spyOn(document, 'execCommand').mockImplementation(() => {});
        const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});

        jest.spyOn(window, 'URLSearchParams').mockImplementation(() => ({
            set: jest.fn(),
            toString: jest.fn(() => 'searchParamsString')
        }));
        jest.spyOn(window.location, 'href', 'get').mockReturnValue('http://example.com');

        RecordSequenceDetails.copy();

        expect(appendChildSpy).toHaveBeenCalledWith(elMock);
        expect(elMock.select).toHaveBeenCalled();
        expect(execCommandSpy).toHaveBeenCalledWith('copy');
        expect(removeChildSpy).toHaveBeenCalledWith(elMock);
        expect(RecordSequenceDetails.copied).toBe(true);

        appendChildSpy.mockRestore();
        execCommandSpy.mockRestore();
        removeChildSpy.mockRestore();
    });
});
