terraform {
  backend "s3" {
    bucket = var.states_bucket
    key    = "terraform.tfstate"

    endpoint = var.states_endpoint

    region           = var.states_region
    force_path_style = true
  }
}
