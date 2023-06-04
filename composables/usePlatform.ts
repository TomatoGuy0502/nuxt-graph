export const usePlatform = () => {
  const isMac = ref(false)
  onMounted(() => {
    isMac.value = navigator.userAgent.includes('Mac')
  })
  return { isMac }
}
