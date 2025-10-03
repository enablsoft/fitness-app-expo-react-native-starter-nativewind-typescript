import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'exercise',
  type: 'document',
  title: 'Exercise',
  description: 'Schema for an exercise, including name, description, difficulty, image, video, and active status.',
  icon: () => '🏋️',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Exercise Name',
      description: 'The name of the exercise that will be displayed to the user.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'A detailed description how to perform the exercise',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'difficulty',
      type: 'string',
      title: 'Difficulty Level',
      description: 'The difficulty level of the exercise.',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Exercise Image',
      description: 'An image showing the proper form or demonstration off the exervise.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: "Description of the exercise image for accessibility and SEO purposes",
          validation: Rule => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'Video URL',
      description: 'A URL link to a video demonstrating the exercise.',
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Is Active',
      description: 'Toogle to show or hide this exercise from the app',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'difficulty',
      media: 'image'
    }
  }
})
