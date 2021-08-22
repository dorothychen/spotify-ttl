import React from 'react';
import {createUseStyles} from "react-jss";
import {COLOR_PINK} from './colors';

type Props = Array<{
    onClick: () => void
    label: string,
}>;

const useStyles = createUseStyles({
    container: {
        marginTop: 20,
    },
    button:{
        border: 'solid',
        display: 'inline-block',
        borderRadius: '12px',
        borderWidth: '2px',
        padding: 6,
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '4px 3px 8px ' + COLOR_PINK,
        }
    }
});

export default function Button({
    onClick,
    label,
}: Props): React.MixedElement {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <div className={styles.button} 
            onClick={onClick}>
                {label}
            </div>
        </div>
    );
}