import {derived, Readable, Writable, writable} from "svelte/store";
import {Genre, instrumentCategories, InstrumentCategory} from "../constants";
import {AudioFormat} from "../broker";
import {MusenetEncoding} from "./encoding";

export const instrumentStores: Record<InstrumentCategory, Writable<boolean>> = instrumentCategories
    .reduce((acc, instrument) => {
        acc[instrument] = writable(instrument === "piano");
        return acc;
    }, {} as Record<InstrumentCategory, Writable<boolean>>);

const instrumentStoreValues: Readable<boolean>[] = Object.values(instrumentStores);

const instrumentsStore = derived<[Readable<boolean>, ...Readable<boolean>[]], Record<InstrumentCategory, boolean>>(
    instrumentStoreValues as [Readable<boolean>, ...Readable<boolean>[]],
    (enabledArray: [boolean, ...boolean[]]) =>
        enabledArray.reduce((acc, enabled, idx) => {
            acc[instrumentCategories[idx]] = enabled;
            return acc;
        }, {} as Record<InstrumentCategory, boolean>)
);

export const generationLengthStore: Writable<number> = writable(200);

export const genreStore: Writable<Genre> = writable("video");
export const temperatureStore: Writable<number> = writable(1);
export const truncationStore: Writable<number> = writable(27);

export const autoRequestStore: Writable<boolean> = writable(false);
export const autoScrollStore: Writable<boolean> = writable(true);
export const isScrollingStore: Writable<boolean> = writable(false);
export const autoPlayStore: Writable<boolean> = writable(true);

export const preplayStore: Writable<number> = writable(2.5);

export const yScaleStore: Writable<number> = writable(100);

export type Config = {
    audioFormat: AudioFormat,
    encoding: MusenetEncoding,
    generationLength: number,
    genre: Genre,
    instrument: Record<InstrumentCategory, boolean>,
    temperature: number,
    truncation: number
}

export const configStore: Readable<Config> = derived(
    [
        generationLengthStore,
        genreStore,
        instrumentsStore,
        temperatureStore,
        truncationStore
    ],
    ([
         $generationLengthStore,
         $genreStore,
         $instrumentsStore,
         $temperatureStore,
         $truncationStore
     ]) => ({
        audioFormat: "mp3",
        encoding: [],
        generationLength: $generationLengthStore,
        genre: $genreStore,
        instrument: $instrumentsStore,
        temperature: $temperatureStore,
        truncation: $truncationStore
    })
);
