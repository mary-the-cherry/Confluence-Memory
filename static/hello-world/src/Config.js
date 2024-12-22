import React from 'react';
import { Label, Select } from '@forge/react';

const Config = () => {
    return (
        <>
            <Label>Choose a theme:</Label>
            <Select
                name="memoryTheme"
                appearance="default"
                options={[
                    { label: 'Flowers', value: 'flowers' },
                    { label: 'Animals', value: 'animals' },
                    { label: 'Landscapes', value: 'landscapes' },
                ]}
            />
        </>
    );
};

export default Config;