import React from 'react';
import {useState} from 'react';

import {createUseStyles} from "react-jss";

type Props = Array<{
    ttlDays: number,
    onChange: (number) => void,
}>;

const useStyles = createUseStyles({
   ttlInput: (props) => ({
        borderTop: 'None',
        borderLeft: 'None',
        borderRight: 'None',
        width: 30,
        borderColor: props.borderColor,
        background: props.background
    })
});

export function getIsTTLDaysInvalid(days: mixed): boolean {
    return isNaN(days) || days === '';
}

export default function TTLInput({
    ttlDays,
    onChange,
}: Props): React.MixedElement {
    const [isValid, setIsValid] = useState<boolean>(true);
    const invalidStyleProps = {
        borderColor: "#cc000054",
        background: "#ffcccc",
    }

    const validStyleProps = {
        borderColor: "black",
        background: undefined,
    }

    const styles = useStyles(isValid ? validStyleProps : invalidStyleProps);

    const onChangeTTL = (event) => {
        const newTTL = event.target.value;
        if (getIsTTLDaysInvalid(newTTL)) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }

        console.log(newTTL);
        onChange(newTTL);
    };

    return (
        <input type="text" 
            value={ttlDays}
            onChange={onChangeTTL}
            className={styles.ttlInput} 
            /> 
    );
}