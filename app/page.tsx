'use client'

import { useState, useEffect } from 'react'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

const CATEGORIES = [
  'Продукты',
  'Транспорт',
  'Развлечения',
  'Здоровье',
  'Одежда',
  'Жильё',
  'Образование',
  'Другое'
]

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])

  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) {
      setExpenses(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString()
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryTotals = CATEGORIES.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(c => c.total > 0)

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount)
  }

  return (
    <div className="container">
      <div className="header">
        <h1>💰 Личные Расходы</h1>
        <p>Управляйте своими финансами эффективно</p>
      </div>

      <div className="main-grid">
        <div className="card">
          <h2>Добавить расход</h2>
          <form onSubmit={addExpense}>
            <div className="form-group">
              <label>Описание</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Например: Продукты в магазине"
                required
              />
            </div>
            <div className="form-group">
              <label>Сумма (₽)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label>Категория</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn">
              Добавить расход
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Статистика</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Всего расходов</h3>
              <p>{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="stat-card">
              <h3>Количество</h3>
              <p>{expenses.length}</p>
            </div>
            <div className="stat-card">
              <h3>Средний расход</h3>
              <p>{expenses.length > 0 ? formatCurrency(totalExpenses / expenses.length) : formatCurrency(0)}</p>
            </div>
          </div>

          {categoryTotals.length > 0 && (
            <>
              <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#333' }}>По категориям</h3>
              <div className="category-stats">
                {categoryTotals.map(({ category, total }) => (
                  <div key={category} className="category-item">
                    <h4>{category}</h4>
                    <p>{formatCurrency(total)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h2>История расходов</h2>
        <div className="expense-list">
          {expenses.length === 0 ? (
            <div className="empty-state">
              <p>Нет расходов</p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                Добавьте свой первый расход используя форму выше
              </p>
            </div>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <span className="expense-category">{expense.category}</span>
                  <div className="expense-description">{expense.description}</div>
                  <div className="expense-date">{formatDate(expense.date)}</div>
                </div>
                <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                <button
                  className="expense-delete"
                  onClick={() => deleteExpense(expense.id)}
                >
                  Удалить
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
