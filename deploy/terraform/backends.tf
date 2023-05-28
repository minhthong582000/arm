terraform {
  backend "s3" {
    bucket                      = "mys3bucket"
    key                         = "demo/terraform/terraform.tfstate"
    endpoint                    = "http://localhost:9000"
    region                      = "us-west-2"
    skip_credentials_validation = true # Skip AWS related checks and validations
    skip_metadata_api_check     = true
    skip_region_validation      = true
    force_path_style            = true
  }
}
