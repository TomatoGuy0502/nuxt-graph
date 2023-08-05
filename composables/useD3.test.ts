// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { useData, useD3EditNode, useD3EditEdge } from './useD3'

describe('useD3', () => {
  it('should call other composables and return all variables and methods', () => {
    const initData = { nodes: [], edges: [] }
    const svgRef = ref<HTMLDivElement | null>(document.createElement('div'))
    const simulationConfig = {}
    const isDirected = ref(false)

    const useD3Return = useD3(initData, svgRef, simulationConfig, isDirected)

    expect(useD3Return).toMatchSnapshot()
  })

  it('object has "apples" key', () => {
    expect({ apples: 22 }).toEqual({ apples: expect.anything() })
  })
})

describe('useData', () => {
  it('should return reactive data', () => {
    const { data } = useData({
      nodes: [{ id: 1 }, { id: 2 }],
      edges: [{ source: '1', target: '2' }],
    })

    expect(isReactive(data)).toBe(true)

    expect(data).toEqual({
      nodes: [{ id: 1 }, { id: 2 }],
      edges: [{ source: '1', target: '2' }],
    })
  })

  it('should be able to clear data', () => {
    const { data, clearData } = useData({
      nodes: [{ id: 1 }, { id: 2 }],
      edges: [{ source: '1', target: '2' }],
    })

    clearData()

    expect(data).toEqual({
      nodes: [],
      edges: [],
    })
  })

  it('should be able to generate random data', () => {
    const { data, generateRandomData } = useData({
      nodes: [],
      edges: [],
    })

    generateRandomData(5, 10)

    expect(data.nodes.length).toBe(5)
    expect(data.edges.length).toBe(10)
  })
})

describe.todo('useD3Simulation', () => {})

describe.todo('useD3Drag', () => {})

describe('useD3EditNode', () => {
  describe('addNode', () => {
    it('should only add node when the left mouse click', () => {
      const data = reactive({
        nodes: [],
        edges: [],
      })
      const { addNode } = useD3EditNode({ data })

      addNode(new MouseEvent('click', { button: 1 }))
      addNode(new MouseEvent('click', { button: 2 }))

      expect(data).toEqual({
        nodes: [],
        edges: [],
      })

      addNode(new MouseEvent('click', { button: 0 }))

      expect(data.nodes.length).toBe(1)
    })

    it('should add node with incremental id', () => {
      const data = reactive({
        nodes: [{ id: 2 }, { id: 4 }],
        edges: [],
      })
      const { addNode } = useD3EditNode({ data })

      addNode(new MouseEvent('click', { button: 0 }))
      addNode(new MouseEvent('click', { button: 0 }))

      expect(data.nodes[2].id).toBe(5)
      expect(data.nodes[3].id).toBe(6)
    })

    it('should add node with correct position', () => {
      const data = reactive({
        nodes: [],
        edges: [],
      })
      const { addNode } = useD3EditNode({ data })

      addNode(
        new MouseEvent('click', { button: 0, clientX: 100, clientY: 100 })
      )
      addNode(
        new MouseEvent('click', { button: 0, clientX: 200, clientY: 200 })
      )

      expect(data.nodes[0]).toMatchObject({ x: 100, y: 100 })
      expect(data.nodes[1]).toMatchObject({ x: 200, y: 200 })
    })
  })

  describe('removeNode', () => {
    it('should remove node', () => {
      const data = reactive({
        nodes: [{ id: 0 }],
        edges: [],
      })
      const { removeNode } = useD3EditNode({ data })

      removeNode(new MouseEvent('click'), data.nodes[0])

      expect(data).toEqual({
        nodes: [],
        edges: [],
      })
    })

    it('should remove edges connected to the removed node', () => {
      const nodes = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
      const edges = [
        { source: nodes[0], target: nodes[1] },
        { source: nodes[1], target: nodes[3] },
        { source: nodes[2], target: nodes[3] },
      ]
      const data = reactive({ nodes, edges })
      const { removeNode } = useD3EditNode({ data })

      removeNode(new MouseEvent('click'), data.nodes[1])

      expect(data).toEqual({
        nodes: [{ id: 0 }, { id: 2 }, { id: 3 }],
        edges: [{ source: { id: 2 }, target: { id: 3 } }],
      })
    })

    it('should unhighlight the removed node', () => {
      const data = reactive({
        nodes: [{ id: 0 }],
        edges: [],
      })
      const { removeNode, hoverNode } = useD3EditNode({ data })

      hoverNode.value = data.nodes[0]

      removeNode(new MouseEvent('click'), data.nodes[0])

      expect(hoverNode.value).toBe(null)
    })
  })

  describe('addLeafNode', () => {
    it('should add leaf node with incremental id', () => {
      const nodes = [
        { id: 0, depth: 0 },
        { id: 3, depth: 1 },
      ]
      const edges = [{ source: nodes[0], target: nodes[1] }]
      const data = reactive({
        nodes,
        edges,
      })
      const { addLeafNode } = useD3EditNode({ data })

      addLeafNode(new MouseEvent('click'), data.nodes[0])
      addLeafNode(new MouseEvent('click'), data.nodes[1])

      expect(data.nodes[2].id).toBe(4)
      expect(data.nodes[3].id).toBe(5)
    })

    it('should add leaf node with incremental depth', () => {
      const nodes = [
        { id: 0, depth: 0 },
        { id: 3, depth: 1 },
      ]
      const edges = [{ source: nodes[0], target: nodes[1] }]
      const data = reactive({
        nodes,
        edges,
      })
      const { addLeafNode } = useD3EditNode({ data })

      addLeafNode(new MouseEvent('click'), data.nodes[0])
      addLeafNode(new MouseEvent('click'), data.nodes[0])
      addLeafNode(new MouseEvent('click'), data.nodes[1])

      expect(data.nodes[2].depth).toBe(1)
      expect(data.nodes[3].depth).toBe(1)
      expect(data.nodes[4].depth).toBe(2)
    })

    it('should add leaf node with correct position', () => {
      const nodes = [
        { id: 0, depth: 0 },
        { id: 3, depth: 1 },
      ]
      const edges = [{ source: nodes[0], target: nodes[1] }]
      const data = reactive({
        nodes,
        edges,
      })
      const { addLeafNode } = useD3EditNode({ data })

      addLeafNode(
        new MouseEvent('click', { clientX: 100, clientY: 100 }),
        data.nodes[0]
      )
      addLeafNode(
        new MouseEvent('click', { clientX: 200, clientY: 200 }),
        data.nodes[1]
      )

      expect(data.nodes[2]).toMatchObject({ x: 100, y: 110 })
      expect(data.nodes[3]).toMatchObject({ x: 200, y: 210 })
    })

    it('should add edge between parent and leaf node', () => {
      const nodes = [
        { id: 0, depth: 0 },
        { id: 3, depth: 1 },
      ]
      const edges = [{ source: nodes[0], target: nodes[1] }]
      const data = reactive({
        nodes,
        edges,
      })
      const { addLeafNode } = useD3EditNode({ data })

      addLeafNode(new MouseEvent('click'), data.nodes[0])
      expect(data.edges.length).toBe(2)
      expect(data.edges.at(-1)?.source).toMatchObject(nodes[0])
      expect(data.edges.at(-1)?.target).toMatchObject({ id: 4, depth: 1 })

      addLeafNode(new MouseEvent('click'), data.nodes[1])
      expect(data.edges.length).toBe(3)
      expect(data.edges.at(-1)?.source).toMatchObject(nodes[1])
      expect(data.edges.at(-1)?.target).toMatchObject({ id: 5, depth: 2 })
    })
  })

  describe('removeSubTree', () => {
    it('should not remove root node', () => {
      const data = reactive({
        nodes: [{ id: 0, depth: 0 }],
        edges: [],
      })
      const { removeSubTree } = useD3EditNode({ data })

      removeSubTree(new MouseEvent('click'), data.nodes[0])

      expect(data).toEqual({
        nodes: [{ id: 0, depth: 0 }],
        edges: [],
      })
    })

    it('should remove sub tree', () => {
      const nodes = [
        { id: 0, depth: 0 },
        { id: 1, depth: 1 },
        { id: 2, depth: 1 },
        { id: 3, depth: 2 },
      ]
      const edges = [
        { source: nodes[0], target: nodes[1] },
        { source: nodes[0], target: nodes[2] },
        { source: nodes[1], target: nodes[3] },
      ]
      const data = reactive({
        nodes,
        edges,
      })
      const { removeSubTree } = useD3EditNode({ data })

      removeSubTree(new MouseEvent('click'), data.nodes[1])

      expect(data).toEqual({
        nodes: [
          { id: 0, depth: 0 },
          { id: 2, depth: 1 },
        ],
        edges: [{ source: { id: 0, depth: 0 }, target: { id: 2, depth: 1 } }],
      })
    })
  })

  it('should handle hover node', () => {
    const data = reactive({
      nodes: [{ id: 0 }],
      edges: [],
    })
    const { hoverNode, highlightNode, unhighlightNode } = useD3EditNode({
      data,
    })

    highlightNode(new MouseEvent('mouseenter'), data.nodes[0])
    expect(hoverNode.value).toEqual({ id: 0 })

    unhighlightNode()
    expect(hoverNode.value).toBe(null)
  })
})

describe('useD3EditEdge', () => {
  it('should handle hover edge', () => {
    const data = reactive({
      nodes: [{ id: 0 }, { id: 1 }],
      edges: [{ source: { id: 0 }, target: { id: 1 } }],
    })
    const { hoverEdge, highlightEdge, unhighlightEdge } = useD3EditEdge({
      data,
      isDirected: ref(false),
    })

    highlightEdge(new MouseEvent('mouseenter'), data.edges[0])
    expect(hoverEdge.value).toEqual({ source: { id: 0 }, target: { id: 1 } })

    unhighlightEdge()
    expect(hoverEdge.value).toBe(null)
  })

  it('should calculate edge cords', () => {
    const translate = 6
    const nodes = [
      { id: 0, x: 50, y: 50 },
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 150, y: 150 },
      { id: 3, x: 150, y: 200 },
      { id: 4, x: 180, y: 200 },
    ]
    const edges = [
      // Both direction
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[0] },
      // Single direction
      { source: nodes[1], target: nodes[2] },
      // Vertical edge and Both direction
      { source: nodes[2], target: nodes[3] },
      { source: nodes[3], target: nodes[2] },
      // Horizontal edge and Both direction
      { source: nodes[3], target: nodes[4] },
      { source: nodes[4], target: nodes[3] },
    ]
    const isDirected = ref(false)
    const data = reactive({
      nodes,
      edges,
    })
    const { edgesCords } = useD3EditEdge({
      data,
      isDirected,
    })

    expect(edgesCords.value[0]).toEqual({
      x1: 50,
      y1: 50,
      x2: 100,
      y2: 100,
    })
    expect(edgesCords.value[1]).toEqual({
      x1: 100,
      y1: 100,
      x2: 50,
      y2: 50,
    })

    expect(edgesCords.value[2]).toEqual({
      x1: 100,
      y1: 100,
      x2: 150,
      y2: 150,
    })

    expect(edgesCords.value[3]).toEqual({
      x1: 150,
      y1: 150,
      x2: 150,
      y2: 200,
    })
    expect(edgesCords.value[4]).toEqual({
      x1: 150,
      y1: 200,
      x2: 150,
      y2: 150,
    })

    expect(edgesCords.value[5]).toEqual({
      x1: 150,
      y1: 200,
      x2: 180,
      y2: 200,
    })
    expect(edgesCords.value[6]).toEqual({
      x1: 180,
      y1: 200,
      x2: 150,
      y2: 200,
    })

    isDirected.value = true
    expect(edgesCords.value[0].x1).toBeCloseTo(45.757, 2)
    expect(edgesCords.value[0].y1).toBeCloseTo(54.242, 2)
    expect(edgesCords.value[0].x2).toBeCloseTo(95.757, 2)
    expect(edgesCords.value[0].y2).toBeCloseTo(104.242, 2)

    expect(edgesCords.value[1].x1).toBeCloseTo(104.242, 2)
    expect(edgesCords.value[1].y1).toBeCloseTo(95.757, 2)
    expect(edgesCords.value[1].x2).toBeCloseTo(54.242, 2)
    expect(edgesCords.value[1].y2).toBeCloseTo(45.757, 2)

    expect(edgesCords.value[2]).toEqual({
      x1: 100,
      y1: 100,
      x2: 150,
      y2: 150,
    })
    expect(edgesCords.value[3]).toEqual({
      x1: 150 - translate,
      y1: 150,
      x2: 150 - translate,
      y2: 200,
    })
    expect(edgesCords.value[4]).toEqual({
      x1: 150 + translate,
      y1: 200,
      x2: 150 + translate,
      y2: 150,
    })
    expect(edgesCords.value[5]).toEqual({
      x1: 150,
      y1: 200 + translate,
      x2: 180,
      y2: 200 + translate,
    })
    expect(edgesCords.value[6]).toEqual({
      x1: 180,
      y1: 200 - translate,
      x2: 150,
      y2: 200 - translate,
    })
  })

  describe('draw edge', () => {
    it('should only begin draw edge when the left mouse click', () => {
      const data = reactive({
        nodes: [
          { id: 0, x: 50, y: 50 },
          { id: 1, x: 100, y: 100 },
        ],
        edges: [],
      })
      const { beginDrawEdge, mousedownNode, drawEdgeCords } = useD3EditEdge({
        data,
        isDirected: ref(false),
      })

      beginDrawEdge(new MouseEvent('click', { button: 1 }), data.nodes[0])
      expect(mousedownNode.value).toBe(null)
      expect(drawEdgeCords).toEqual({ x1: 0, y1: 0, x2: 0, y2: 0 })

      beginDrawEdge(new MouseEvent('click', { button: 0 }), data.nodes[0])
      expect(mousedownNode.value).toEqual({ id: 0, x: 50, y: 50 })
      expect(drawEdgeCords).toEqual({ x1: 50, y1: 50, x2: 0, y2: 0 })
    })

    it('should update draw edge cords only when it began drawing', () => {
      const data = reactive({
        nodes: [
          { id: 0, x: 50, y: 50 },
          { id: 1, x: 100, y: 100 },
        ],
        edges: [],
      })
      const { beginDrawEdge, updateDrawEdge, mousedownNode, drawEdgeCords } =
        useD3EditEdge({
          data,
          isDirected: ref(false),
        })
      const mouseMoveTo = (x: number, y: number) =>
        new MouseEvent('mousemove', { clientX: x, clientY: y })

      updateDrawEdge(mouseMoveTo(100, 100))
      expect(mousedownNode.value).toBe(null)
      expect(drawEdgeCords).toEqual({ x1: 0, y1: 0, x2: 0, y2: 0 })

      beginDrawEdge(new MouseEvent('click', { button: 0 }), data.nodes[0])
      updateDrawEdge(mouseMoveTo(100, 100))
      expect(drawEdgeCords).toEqual({ x1: 50, y1: 50, x2: 100, y2: 100 })

      updateDrawEdge(mouseMoveTo(150, 150))
      expect(drawEdgeCords).toEqual({ x1: 50, y1: 50, x2: 150, y2: 150 })
    })

    it('should add edge when drawing is valid', () => {
      const nodes = [
        { id: 0, x: 50, y: 50 },
        { id: 1, x: 100, y: 100 },
        { id: 2, x: 150, y: 150 },
      ]
      const data = reactive({
        nodes,
        edges: [{ source: nodes[0], target: nodes[1] }],
      })
      const isDirected = ref(false)
      const { beginDrawEdge, endDrawEdge } = useD3EditEdge({
        data,
        isDirected,
      })
      const _clickEvent = new MouseEvent('click', { button: 0 })

      // Didn't begin drawing
      endDrawEdge(_clickEvent, data.nodes[0])
      expect(data.edges.length).toBe(1)

      // End drawing at the same node
      beginDrawEdge(_clickEvent, data.nodes[0])
      endDrawEdge(_clickEvent, data.nodes[0])
      expect(data.edges.length).toBe(1)

      // Edge already exists
      beginDrawEdge(_clickEvent, data.nodes[0])
      endDrawEdge(_clickEvent, data.nodes[1])
      expect(data.edges.length).toBe(1)

      // Valid edge
      beginDrawEdge(_clickEvent, data.nodes[0])
      endDrawEdge(_clickEvent, data.nodes[2])
      expect(data.edges[1]).toEqual({
        source: { id: 0, x: 50, y: 50 },
        target: { id: 2, x: 150, y: 150 },
      })

      data.edges.splice(1, 1)
      endDrawEdge(_clickEvent, data.nodes[2], { withWeight: true })
      expect(data.edges[1]).toEqual({
        source: { id: 0, x: 50, y: 50 },
        target: { id: 2, x: 150, y: 150 },
        weight: expect.any(Number),
      })

      isDirected.value = true

      // Valid directed edge
      beginDrawEdge(_clickEvent, data.nodes[1])
      endDrawEdge(_clickEvent, data.nodes[0])
      expect(data.edges[2]).toEqual({
        source: { id: 1, x: 100, y: 100 },
        target: { id: 0, x: 50, y: 50 },
      })

      data.edges.splice(2, 1)
      endDrawEdge(_clickEvent, data.nodes[0], { withWeight: true })
      expect(data.edges[2]).toEqual({
        source: { id: 1, x: 100, y: 100 },
        target: { id: 0, x: 50, y: 50 },
        weight: expect.any(Number),
      })
    })

    it('should be able to hide draw edge', () => {
      const { mousedownNode, hideDrawEdge } = useD3EditEdge({
        data: {
          nodes: [{ id: 0, x: 50, y: 50 }],
          edges: [],
        },
        isDirected: ref(false),
      })

      mousedownNode.value = { id: 0, x: 50, y: 50 }
      hideDrawEdge()
      expect(mousedownNode.value).toBe(null)
    })
  })

  describe('remove edge', () => {
    it('should remove single edge in directed graph', () => {
      const nodes = [
        { id: 0, x: 50, y: 50 },
        { id: 1, x: 100, y: 100 },
      ]
      const edges = [
        { source: nodes[0], target: nodes[1] },
        { source: nodes[1], target: nodes[0] },
      ]
      const data = reactive({
        nodes,
        edges,
      })
      const { removeEdge } = useD3EditEdge({
        data,
        isDirected: ref(true),
      })

      removeEdge(new MouseEvent('click'), data.edges[0])

      expect(data).toEqual({
        nodes: [
          { id: 0, x: 50, y: 50 },
          { id: 1, x: 100, y: 100 },
        ],
        edges: [{ source: nodes[1], target: nodes[0] }],
      })
    })

    it('should remove both edge in undirected graph', () => {
      const nodes = [{ id: 0 }, { id: 1 }]
      const edges = [
        { source: nodes[0], target: nodes[1] },
        { source: nodes[1], target: nodes[0] },
      ]
      const data = reactive({
        nodes,
        edges,
      })
      const { removeEdge } = useD3EditEdge({
        data,
        isDirected: ref(false),
      })

      removeEdge(new MouseEvent('click'), data.edges[0])

      expect(data).toEqual({
        nodes: [{ id: 0 }, { id: 1 }],
        edges: [],
      })
    })

    it('should unhighlight the removed edge', () => {
      const data = reactive({
        nodes: [{ id: 0 }, { id: 1 }],
        edges: [{ source: { id: 0 }, target: { id: 1 } }],
      })
      const { removeEdge, hoverEdge } = useD3EditEdge({
        data,
        isDirected: ref(false),
      })

      hoverEdge.value = data.edges[0]

      removeEdge(new MouseEvent('click'), data.edges[0])

      expect(hoverEdge.value).toBe(null)
    })
  })
})

describe.skip('useGraphRepresentation', () => {
  it('should return adjacency matrix', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
    ]
    const edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
    ]
    const data = reactive({
      nodes,
      edges,
    })
    const isDirected = ref(false)
    const { adjacencyMatrix } = useGraphRepresentation({
      data,
      isDirected,
    })

    expect(adjacencyMatrix.value).toEqual([
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ])

    isDirected.value = true
    expect(adjacencyMatrix.value).toEqual([
      [0, 1, 0],
      [0, 0, 1],
      [0, 0, 0],
    ])
  })

  it('should return adjacency list', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
    ]
    const edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
    ]
    const isDirected = ref(false)
    const data = reactive({
      nodes,
      edges,
    })
    const { adjacencyList } = useGraphRepresentation({
      data,
      isDirected,
    })

    expect(adjacencyList.value).toEqual([[1], [0, 2], [1]])

    isDirected.value = true
    expect(adjacencyList.value).toEqual([[1], [2], []])
  })

  it('should return edge list', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
    ]
    const edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
      { source: nodes[2], target: nodes[1] },
    ]
    const isDirected = ref(false)
    const data = reactive({
      nodes,
      edges,
    })
    const { edgeList } = useGraphRepresentation({
      data,
      isDirected,
    })

    expect(edgeList.value).toEqual([
      { sourceId: 0, targetId: 1 },
      { sourceId: 1, targetId: 2 },
      { sourceId: 2, targetId: 1 },
    ])
  })
})

describe.skip('useGraphProperties', () => {
  it('should return graph properties', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
      { id: 3, index: 3 },
    ]
    const edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[2] },
      { source: nodes[1], target: nodes[2] },
    ]
    const isDirected = ref(false)
    const adjacencyList = ref([[1, 2], [0, 2], [0, 1], []])
    const data = reactive({
      nodes,
      edges,
    })

    const { graphProperties } = useGraphProperties({
      data,
      adjacencyList,
      isDirected,
    })
    // Has cycle, 2 connected components
    expect(graphProperties.value).toEqual({
      hasCycle: true,
      connectedComponents: [[0, 1, 2], [3]],
      isTree: false,
      isForest: false,
      isComplete: false,
    })

    // No cycle, 2 connected component
    data.edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[1], target: nodes[2] },
    ]
    adjacencyList.value = [[1], [0, 2], [1], []]
    expect(graphProperties.value).toEqual({
      hasCycle: false,
      connectedComponents: [[0, 1, 2], [3]],
      isTree: false,
      isForest: true,
      isComplete: false,
    })

    // No cycle, 1 connected component(tree)
    data.edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[3] },
      { source: nodes[1], target: nodes[2] },
    ]
    adjacencyList.value = [[1, 3], [0, 2], [1], []]
    expect(graphProperties.value).toEqual({
      hasCycle: false,
      connectedComponents: [[0, 1, 2, 3]],
      isTree: true,
      isForest: true,
      isComplete: false,
    })

    // Complete graph
    data.edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[2] },
      { source: nodes[0], target: nodes[3] },
      { source: nodes[1], target: nodes[2] },
      { source: nodes[1], target: nodes[3] },
      { source: nodes[2], target: nodes[3] },
    ]
    adjacencyList.value = [
      [1, 2, 3],
      [0, 2, 3],
      [0, 1, 3],
      [0, 1, 2],
    ]
    expect(graphProperties.value).toEqual({
      hasCycle: true,
      connectedComponents: [[0, 1, 2, 3]],
      isTree: false,
      isForest: false,
      isComplete: true,
    })

    isDirected.value = true
    data.nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
    ]
    data.edges = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[2] },
      { source: nodes[1], target: nodes[0] },
      { source: nodes[1], target: nodes[2] },
      { source: nodes[2], target: nodes[0] },
      { source: nodes[2], target: nodes[1] },
    ]
    adjacencyList.value = [
      [1, 2],
      [0, 2],
      [0, 1],
    ]
    expect(graphProperties.value).toEqual({
      hasCycle: true,
      connectedComponents: [[0, 1, 2]],
      isTree: false,
      isForest: false,
      isComplete: true,
    })
  })

  it('should return connected component colors', () => {
    const nodes = [
      { id: 0, index: 0 },
      { id: 1, index: 1 },
      { id: 2, index: 2 },
      { id: 3, index: 3 },
    ]
    const edges = [{ source: nodes[0], target: nodes[1] }]
    const isDirected = ref(false)
    const adjacencyList = ref([[1], [0], [], []])
    const data = reactive({
      nodes,
      edges,
    })

    const { nodesComponentColorIndex } = useGraphProperties({
      data,
      adjacencyList,
      isDirected,
    })

    expect(nodesComponentColorIndex.value).toEqual([0, 0, 1, 2])
  })
})
