########## EC2 Variables ##########
variable "hostname" {
  description = "Hostname of the EC2 instance"
  type        = string
  default     = "arm"
}

variable "instance_number_prefix" {
  description = "Prefix digits of EC2 instances"
  type        = string
  default     = "%02d" # Format the integer with 2 digits, left padding it with zeroes
}

variable "instance_count" {
  description = "Number of EC2 instances"
  type        = number
  default     = 1
}
