import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmployeeSchema, EmployeeFormData } from '../validations/employee.validation'

const EmployeeForm: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(EmployeeSchema)
  });

  const onSubmit = (data: EmployeeFormData) => {
    console.log(data)
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields with error handling */}
      <div>
        <label>Name</label>
        <input 
          {...register('name')} 
          type="text" 
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      {/* Add other form fields similarly */}
      
      <button type="submit">Submit</button>
    </form>
  )
}

export default EmployeeForm