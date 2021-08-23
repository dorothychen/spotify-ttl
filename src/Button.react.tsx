import React from 'react';
import {createUseStyles} from "react-jss";
import {COLOR_PINK} from './colors';

type Props = Array<{
    onClick: () => void
    label: string,
    isDisabled: boolean,
}>;

const useStyles = createUseStyles({
    button: (props) => ({
        border: 'solid',
        display: 'inline-block',
        borderRadius: '12px',
        borderWidth: '2px',
        padding: 6,
        cursor: props.cursor,
        color: props.color,
        backgroundColor: props.backgroundColor,
        '&:hover': {
            boxShadow: props.hoverShadow,
        }
    })
});

export default function Button({
    onClick,
    label,
    isDisabled,
}: Props): React.MixedElement {
    const enabledProps = {
        hoverShadow: '4px 3px 8px ' + COLOR_PINK,
        cursor: 'pointer',
        color: 'black',
        backgroundColor: undefined,
    };

    const disabledProps = {
        hoverShadow: undefined,
        cursor: 'default',
        color: 'darkgrey',
        backgroundColor: '#F5F5F5',
    }

    const styleProps = isDisabled ? disabledProps : enabledProps;

    const styles = useStyles(styleProps);

    return (
        <div className={styles.container}>
            <div 
                className={styles.button} 
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick={isDisabled ? () => {} : onClick}
                >
                {label}
            </div>
        </div>
    );
}