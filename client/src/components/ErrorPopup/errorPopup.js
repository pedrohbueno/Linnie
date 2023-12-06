import React from "react";
import styles from "./css/skirt.module.css"

import linmin from "./img/linmin.svg"

function SkirtPopup(props) {
    return (props.trigger) ? (
        <div className={`${styles.skirtPopup}`}>
            <div className={styles.bg}></div>
            <div className={`card p-5 ${styles.skirtPopupInner}`}>
                <img src={linmin} alt="" className={`${styles.cardFigure}`} />
                <svg className='card-img-overlay' width="100%" height="100%">
                    <rect x="5" y="5" width="98%" height="97%" style={{fill:'transparent', strokeWidth:'5', stroke:'#C25E84', strokeDasharray:'8', strokeLinecap:'round'}} />
                </svg>
                <button className={`btn ${styles.closeBtn}`} onClick={() => props.setTrigger(false)}> <h1 >X</h1> </button>
                <h1>Erro</h1>
                <h3>{props.error}</h3>
            </div>
        </div>
     ) : "";
}

export default SkirtPopup;