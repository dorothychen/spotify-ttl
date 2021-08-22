import React from 'react';
import {createUseStyles} from "react-jss";

type Props = Array<{
    onClick: () => void
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
            boxShadow: '4px 3px 8px #ebbab9',
        }
    }
});

export default function SubmitButton({
    onClick
}: Props): React.MixedElement {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <div className={styles.button} 
            onClick={onClick}>
                SUBMIT
            </div>
        </div>
    );
}