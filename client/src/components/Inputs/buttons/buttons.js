import { Link } from 'react-router-dom'
import styles from './css/buttons.module.css'

function ButtonYellow({text, width, link}) {
    return(
        <Link to={link} className={`${styles.link2} ${styles.btnExplore}`} style={{width:width}}>{text}</Link>
    )
}
function ButtonPink({text, width, link}) {
    return(
        <Link to={link}  className={`${styles.link} ${styles.btnCreate}`} style={{width:width}}>{text}</Link>
    )
}



export {ButtonPink, ButtonYellow}