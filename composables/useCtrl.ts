const isCtrlOrCmdPressed = ref(false)

export const useCtrl = () => {
  const { isMac } = usePlatform()

  const keyDownHandler = (e: KeyboardEvent) => {
    if (
      (!isMac.value && e.key === 'Control') ||
      (isMac.value && e.key === 'Meta')
    ) {
      isCtrlOrCmdPressed.value = true
    }
  }
  const keyupHandler = (e: KeyboardEvent) => {
    if (
      (!isMac.value && e.key === 'Control') ||
      (isMac.value && e.key === 'Meta')
    ) {
      isCtrlOrCmdPressed.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyupHandler)
  })
  onUnmounted(() => {
    document.removeEventListener('keydown', keyDownHandler)
    document.removeEventListener('keyup', keyupHandler)
  })

  return { isCtrlOrCmdPressed }
}
