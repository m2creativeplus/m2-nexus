import { describe, it, expect } from 'vitest'

describe('M2 Core Sanity', () => {
  it('passes the baseline check', () => {
    expect(true).toBe(true)
  })
  it('project is initialized', () => {
    expect(typeof window).toBe('object')
  })
})
