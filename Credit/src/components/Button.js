import React from 'react'

interface Props{
    children: String;
    color?: 'primary' | 'secondary'|'success';
    onClick: () => void;
}

const Button = ({children, onClick, color='primary'}: props) => {
  return (
      <button className={'btn btn-' + color} onClick={onClick}>{children}</button>
  )
}

export default Button