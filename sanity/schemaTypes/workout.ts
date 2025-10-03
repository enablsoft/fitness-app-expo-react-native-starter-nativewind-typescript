import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'workout',
  type: 'document',
  title: 'Workout',
  description: 'Schema for a workout session, including user, date, duration, and performed exercises.',
  icon: () => '💪',
  fields: [
    defineField({
      name: 'userId',
      type: 'string',
      title: 'User ID',
      description: "The Clerk user ID of the person who performed this workout",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      title: 'Date',
      description: 'The date and time when this workout was performed.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'duration',
      type: 'number',
      title: 'Duration (seconds)',
      description: 'The total duration of the workout in seconds.',
      validation: Rule => Rule.required().min(1),
    }),
    defineField({
      name: 'exercises',
      type: 'array',
      title: 'Workout Exercises',
      description: 'The exercises performed in this workout, with sets, reps and weights.',
      of: [
        defineField({
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              type: 'reference',
              to: [{ type: 'exercise' }],
              title: 'Exercise',
              description: 'Reference to the exercise that was performed.',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'sets',
              type: 'array',
              title: 'Sets',
              description: 'The sets performed for this exercise, including reps, weight, and weight unit.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'exerciseset',
                  title: 'Exercise Set',
                  fields: [
                    defineField({
                      name: 'reps',
                      type: 'number',
                      title: 'Repetitions',
                      description: 'The number of repetitions performed in this set.',
                      validation: Rule => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weight',
                      type: 'number',
                      title: 'Weight',
                      description: 'The weight used for this set.',
                      validation: Rule => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      type: 'string',
                      title: 'Weight Unit',
                      description: 'The unit of measurement for this weight (lbs or kg).',
                      options: {
                        list: [
                          { title: 'Pounds (lbs)', value: 'lbs' },
                          { title: 'Kilograms (kg)', value: 'kg' },
                        ],
                        layout: 'dropdown',
                      },
                      initialValue: 'lbs'
                    }),
                  ],
                preview: {
                  select: {
                    reps: 'reps',
                    weight: 'weight',
                    weightUnit: 'weightUnit',
                  },
                  prepare({ reps, weight, weightUnit }) {
                    return {
                      title: `Set: ${reps ? reps : ''} reps`,
                      subtitle: weight ? `${weight} ${weightUnit}` : 'Bodyweight',
                    };
                  },
                },
                }),
              ],
              validation: Rule => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
                title: 'exercise.name',
                sets: 'sets',
            },
            prepare({title,sets}) {
                const setCount = sets ? sets.length : 0
                return {
                    title: title || 'Exercise',
                    subtitle: `${setCount} set${setCount !== 1 ? 's': ''}`
                }
            },
          },   
        }),
      ],
    }),
  ],
  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
    },
    prepare({date, duration, exercises}) {
      const workoutDate = date ? new Date(date).toLocaleDateString(): 'No date'
      const durationMinutes = duration ? Math.round(duration / 60) : 0
      const exerciseCount = exercises ? exercises.length : 0
      return {
        title: `Workout - ${workoutDate}`,
        subtitle: `${durationMinutes} min * ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`
      }
    }
  }
})
