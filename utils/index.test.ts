import { describe, expect, it } from 'vitest'
import { generateRandomGraphData, almostEqual } from './index'

describe('utils', () => {
  describe('generateRandomGraphData', () => {
    it('should generate correct number of nodes and edges', () => {
      const data = generateRandomGraphData(5, 5)
      expect(data.nodes.length).toBe(5)
      expect(data.edges.length).toBe(5)
    })
    it('should generate edges within the range of possible edges', () => {
      const data = generateRandomGraphData(5, 100)
      expect(data.edges.length).toBe(10)
      const data2 = generateRandomGraphData(10, 1000)
      expect(data2.edges.length).toBe(45)
    })
  })

  describe('almostEqual', () => {
    it('should return true if two numbers are almost equal', () => {
      expect(almostEqual(0.1, 0.1005, 0.01)).toBe(true)
    })
    it('should return false if two numbers are not almost equal', () => {
      expect(almostEqual(0.1, 0.1005, 0.0001)).toBe(false)
    })
  })
})
