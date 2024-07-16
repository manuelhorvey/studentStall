import React from 'react'
import styles from './footer.module.css'

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>B I R D</div>
      <div className={styles.text}>copyright reserved 2024</div>
    </div>
  )
}

export default Footer