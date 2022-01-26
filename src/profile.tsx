import React, { createElement, useState } from 'react';
import { fold, RemoteData } from "@devexperts/remote-data-ts"
import { FC } from "react"
import { constNull, pipe } from 'fp-ts/lib/function';

export type ProfileProps = {
    readonly name: RemoteData<Error, string>;
    readonly onNameUpdate: (name: string) => void;
}

export const renderRemoteData = <A extends unknown>(
    onSuccess: (a: A) => JSX.Element | null,
): ((data: RemoteData<Error, A>) => JSX.Element | null) =>
    fold(
        constNull,
        () => createElement('div', null, 'pending'),
        () => createElement('div', null, 'failure'),
        onSuccess,
    );

export const Profile: FC<ProfileProps> = ({ name, onNameUpdate }) => {
    return <>
        {pipe(
            name,
            renderRemoteData(name => createElement('div', null, name)),
        )}
        <button onClick={() => onNameUpdate('changed')} />
    </>
}