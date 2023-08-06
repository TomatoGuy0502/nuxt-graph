export const useExercise = () => {
  const finishedExercise = useState('finished', () => 0)
  onMounted(() => {
    finishedExercise.value = 0
  })

  return {
    finishedExercise,
  }
}
