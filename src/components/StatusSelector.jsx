import styles from './StatusSelector.module.css';

const statusOptions = [
  { value: 'nao-assistido', label: 'Não assistido', icon: '○', color: '#666' },
  { value: 'preciso-revisar', label: 'Preciso revisar', icon: '↻', color: '#ffa500' },
  { value: 'conteudo-dificil', label: 'Conteúdo difícil', icon: '⚠', color: '#ff3b30' },
  { value: 'dominei', label: 'Dominei', icon: '✓', color: '#00ff88' }
];

const StatusSelector = ({ currentStatus, onStatusChange }) => {
  return (
    <div className={styles.statusSelector}>
      {statusOptions.map((option) => (
        <button
          key={option.value}
          className={`${styles.statusButton} ${
            currentStatus === option.value ? styles.active : ''
          }`}
          onClick={() => onStatusChange(option.value)}
          style={{
            borderColor: currentStatus === option.value ? option.color : 'transparent',
            backgroundColor: currentStatus === option.value 
              ? `${option.color}20` 
              : 'transparent'
          }}
        >
          <span 
            className={styles.statusIcon}
            style={{ color: option.color }}
          >
            {option.icon}
          </span>
          <span className={styles.statusLabel}>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default StatusSelector;
