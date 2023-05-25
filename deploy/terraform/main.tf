data "template_file" "user_data" {
  count = var.instance_count
  template = templatefile("${path.module}/templates/user_data.tpl", {
    hostname = "${var.hostname}-${format(var.instance_number_prefix, count.index + 1)}"
  })
}
