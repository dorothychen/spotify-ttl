import React from 'react';
import Button from './Button.react';
import {createUseStyles} from "react-jss";

type Props = Array<{
    onClick: () => void
}>;

const useStyles = createUseStyles({
    logoutButton: {
        position: "absolute",
        top: 10,
        right: 40,
    },
});

export default function LogoutButton({
    onClick
}: Props): React.MixedElement {
    const styles = useStyles();

    return (
        <div className={styles.logoutButton}>
            <Button label="LOG OUT" onClick={onClick} />
        </div>
    );
}