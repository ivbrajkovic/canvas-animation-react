import styles from "./styles.module.css";

const SwitchButton = ({ label, id, onChange, checked }) => {
  const handelChange = ({ target: { checked } }) =>
    onChange && onChange(checked);
  return (
    <div className={styles.root}>
      {label && <div className={styles.label}>{label}</div>}
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={handelChange}
      />
      <label htmlFor={id} className={styles.checkboxLabel} />
    </div>
  );
};

export default SwitchButton;
