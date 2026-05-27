import { Employee } from '../types/data';
import { employeesData } from '../data/employees';

// Simulates an async API layer over the local JSON dataset
// In production this would be real HTTP calls - same interface, just swap the impl

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export async function fetchEmployees(): Promise<Employee[]> {
  // Simulate network latency
  await delay(400);
  return [...employeesData];
}

export async function fetchEmployee(id: number): Promise<Employee | null> {
  await delay(200);
  return employeesData.find(e => e.id === id) ?? null;
}
