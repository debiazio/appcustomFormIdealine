import React, { useState } from 'react'
import styles from './styles-newsletter.css'

const NewsletterForm: React.FC = () => {
  const [form, setForm] = useState({
    nome: '',
    email: ''
  })

  const [errors, setErrors] = useState({
    nome: '',
    email: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  // Valida campo individual (em tempo real + onBlur)
  const validateField = (name: string, value: string) => {
    const newErrors: any = { ...errors }

    switch (name) {
      case 'nome':
        newErrors.nome =
          /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)
            ? ''
            : 'O nome deve conter apenas letras'
        break

      case 'email':
        newErrors.email =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ''
            : 'E-mail inválido'
        break
    }

    setErrors(newErrors)
  }

  // Atualiza estado + valida em tempo real
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    validateField(name, value)
  }

  // Verifica se tudo está válido
  const isFormValid = () => {
    const noErrors = Object.values(errors).every((e) => e === '')
    const allFilled = Object.values(form).every((v) => v.trim() !== '')
    return noErrors && allFilled
  }

  const validateForm = () => {
    Object.keys(form).forEach((key) =>
      validateField(key, (form as any)[key])
    )
    return isFormValid()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSuccess(false)
    setError(false)

    try {
      const payload = {
        name: form.nome,
        email: form.email
      }

      const res = await fetch('/api/dataentities/NL/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vtex.ds.v10+json'
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setSuccess(true)
        setForm({ nome: '', email: '' })
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

      <form onSubmit={handleSubmit} className={styles.fcform}>

        {/* Nome */}
        <div className={styles.divnome}>

        <input
          type="text"
          name="nome"
          placeholder="Seu nome"
          value={form.nome}
          onChange={handleChange}
          onBlur={(e) => validateField('nome', e.target.value)}
          className={styles.fcinput}
        />
        {errors.nome && <p className={styles.fcerror}>{errors.nome}</p>}

        </div>

        {/* Email */}
        <div className={styles.divemail}>
        <input
          type="email"
          name="email"
          placeholder="Seu email"
          value={form.email}
          onChange={handleChange}
          onBlur={(e) => validateField('email', e.target.value)}
          className={styles.fcinput}
        />
        {errors.email && <p className={styles.fcerror}>{errors.email}</p>}
        </div>

        <div className={styles.divbutton}>
        <button
          type="submit"
          disabled={!isFormValid() || loading}
          className={styles.fcbutton}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
        </div>

        {success && (
          <p className={styles.fcsuccess}>Inscrição realizada com sucesso!</p>
        )}
        {error && (
          <p className={styles.fcerror}>
            Ocorreu um erro ao enviar. Tente novamente.
          </p>
        )}
      </form>
    </div>
  )
}

export default NewsletterForm
