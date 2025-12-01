import React, { useState } from 'react'
import styles from './styles.css'

const FaleConoscoForm: React.FC = () => {
  const [form, setForm] = useState({
    assunto: '',
    mensagem: '',
    email: '',
    nome: '',
    telefone: ''
  })

  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    let formatted = digits.replace(/^(\d{2})(\d)/g, '($1)$2')
    formatted = formatted.replace(/(\d{5})(\d)/, '$1-$2')
    return formatted
  }

  const validateField = (name: string, value: string) => {
    const newErrors: any = { ...errors }

    switch (name) {
      case 'nome':
        newErrors.nome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)
          ? ''
          : 'O nome deve conter apenas letras'
        break

      case 'telefone': {
        const digits = value.replace(/\D/g, '')

        if (digits.length !== 11) {
          newErrors.telefone = 'O telefone deve ter 11 números'
        } else if (digits.substring(0, 2) === '00') {
          newErrors.telefone = 'DDD inválido'
        } else if (/^(\d)\1+$/.test(digits)) {
          newErrors.telefone = 'Telefone inválido'
        } else {
          newErrors.telefone = ''
        }
        break
      }

      case 'email':
        newErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'E-mail inválido'
        break

      case 'assunto':
        newErrors.assunto = value.trim() === '' ? 'O assunto é obrigatório' : ''
        break

      case 'mensagem':
        newErrors.mensagem = value.trim() === '' ? 'A mensagem é obrigatória' : ''
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target

    if (name === 'telefone') {
      value = maskPhone(value)
    }

    setForm({ ...form, [name]: value })
    validateField(name, value)
  }

  const validateForm = () => {
    Object.keys(form).forEach((key) =>
      validateField(key, (form as any)[key])
    )
    return isFormValid()
  }

  const isFormValid = () => {
    const noErrors = Object.values(errors).every((e) => e === '')
    const allFilled = Object.values(form).every((v) => v.trim() !== '')
    return noErrors && allFilled
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSuccess(false)
    setError(false)

    try {
      const res = await fetch('/api/dataentities/CT/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vtex.ds.v10+json'
        },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setSuccess(true)
        setForm({ assunto: '', mensagem: '', email: '', nome: '', telefone: '' })
      } else {
        setError(true)
      }
    } catch (err) {
      console.error(err)
      setError(true)
    }

    setLoading(false)
  }

  return (
    <div className={styles.fccontainer}>
      <h2 className={styles.fctitle}>Fale Conosco</h2>

      <form onSubmit={handleSubmit} className={styles.fcform}>

        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          onBlur={(e) => validateField('nome', e.target.value)}
          className={styles.fcinput}
        />
        {errors.nome && <p className={styles.fcerror}>{errors.nome}</p>}

        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          onBlur={(e) => validateField('telefone', e.target.value)}
          className={styles.fcinput}
        />
        {errors.telefone && <p className={styles.fcerror}>{errors.telefone}</p>}

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          onBlur={(e) => validateField('email', e.target.value)}
          className={styles.fcinput}
        />
        {errors.email && <p className={styles.fcerror}>{errors.email}</p>}

        <input
          type="text"
          name="assunto"
          placeholder="Assunto"
          value={form.assunto}
          onChange={handleChange}
          onBlur={(e) => validateField('assunto', e.target.value)}
          className={styles.fcinput}
        />
        {errors.assunto && <p className={styles.fcerror}>{errors.assunto}</p>}

        <textarea
          name="mensagem"
          placeholder="Mensagem"
          value={form.mensagem}
          onChange={handleChange}
          onBlur={(e) => validateField('mensagem', e.target.value)}
          className={styles.fctextarea}
        />
        {errors.mensagem && <p className={styles.fcerror}>{errors.mensagem}</p>}

        <button
          type="submit"
          disabled={!isFormValid() || loading}
          className={styles.fcbutton}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>

        {success && <p className={styles.fcsuccess}>Mensagem enviada com sucesso!</p>}
        {error && <p className={styles.fcerror}>Ocorreu um erro ao enviar.</p>}
      </form>
    </div>
  )
}

export default FaleConoscoForm
